using Abstracciones.Entities;
using Abstracciones.Interfaces.Repository;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using Azure.Core;
using Repository;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services
{
    public class AlbumServices : IAlbumServices
    {
        private readonly IAlbumRepository _albumRepository;
        private readonly IMediaRepository _mediaRepository;
        
        public AlbumServices(IAlbumRepository albumRepository, IMediaRepository mediaRepository) 
        { 
            _albumRepository = albumRepository;
            _mediaRepository = mediaRepository;
        }
        public async Task<Guid> AddAlbum(AlbumRequest albumRequest)
        {
            if (albumRequest != null) 
            {
                Guid albumId = Guid.NewGuid();
                await _albumRepository.AddAlbum(new AlbumEntity { idAlbum=albumId, Name = albumRequest.Name, CreatedAt=DateTime.UtcNow, State=1, CoverMediaId=albumRequest.CoverMediaId });
                return albumId;
            }
            else
            {
                throw new ArgumentNullException(nameof(albumRequest), "Album request cannot be null.");
            }
        }
        public async Task<Guid> AddAlbumMedia(AlbumMediaRequest albumMediaRequest)
        {
            var newMediaIds = await ValidateDataAlbumMedia(albumMediaRequest);
            IEnumerable<AlbumMediaEntity> albumMedia = newMediaIds.Select(mediaId => new AlbumMediaEntity
            {
                idAlbumMedia = Guid.NewGuid(),
                idAlbum = albumMediaRequest.idAlbum,
                IdMedia = mediaId,
                State = 1,
                CreatedAt = DateTime.UtcNow
            });
            await _albumRepository.AddAlbumMedia(albumMedia);
            return albumMediaRequest.idAlbum;
        }

        public async Task<Guid> DeleteAlbum(Guid idAlbum)
        {
            await _albumRepository.DeleteAlbum(idAlbum);
            return idAlbum;
        }

        public async Task<Guid> DeleteAlbumMedia(Guid idAlbum, Guid idMedia)
        {
            await _albumRepository.DeleteAlbumMedia(idAlbum, idMedia);
            return idAlbum;
        }

        public async Task<AlbumMediaResponse?> GetAlbumMedia(Guid idAlbum) => await _albumRepository.GetAlbumMedia(idAlbum);
        public async Task<IEnumerable<AlbumEntity>> GetAlbums() => await _albumRepository.GetAlbums();

        private async Task<List<Guid>> ValidateDataAlbumMedia(AlbumMediaRequest albumMediaRequest) 
        {
            var mediaIds = albumMediaRequest.IdMedias.Distinct().ToList();
            // 1. el álbum debe existir
            if (!await _albumRepository.AlbumExists(albumMediaRequest.idAlbum))
                throw new InvalidOperationException("The specified album does not exist.");
            // 2. las imágenes deben existir
            var validCount = await _mediaRepository.CountByIdsAsync(mediaIds);
            if (validCount != mediaIds.Count)
                throw new InvalidOperationException("One or more specified media items do not exist.");
            // 3. evitar duplicados
            var alreadyInAlbum = await _albumRepository.GetExistingMediaIdsAsync(albumMediaRequest.idAlbum, mediaIds);
            var newMediaIds = mediaIds.Except(alreadyInAlbum).ToList();

            if (newMediaIds.Count == 0)
                throw new InvalidOperationException("All specified media items are already in the album.");
            return newMediaIds;

        }
    }
}
