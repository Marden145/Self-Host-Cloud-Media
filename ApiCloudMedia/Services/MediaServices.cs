using Abstracciones.Entities;
using Abstracciones.Enums;
using Abstracciones.Interfaces.Repository;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using Abstracciones.Models.Request;
using System;
using System.IO;
using System.IO.Pipelines;
using System.Threading;
using System.Threading.Tasks;
namespace Services
{
    public class MediaServices : IMediaServices
    {
        private readonly IMediaRepository _mediaRepository;
        public MediaServices(IMediaRepository mediaRepository)
        {
            _mediaRepository = mediaRepository;
        }
        public async Task<Guid> SaveMediaAsync(MediaRequest mediaRequest, CancellationToken cancellationToken)
        {
            var file = mediaRequest.File;
            string fileName = GetFileName(Path.GetExtension(file.FileName));

            await using var stream = file.OpenReadStream();
            var storagePath = await SaveAsync(
            stream,
            fileName,
            cancellationToken);
            MediaEntitie mediaEntity = CreateMediaEntitie(mediaRequest, storagePath);
            await _mediaRepository.AddMedia(mediaEntity);
            return mediaEntity.Id;
        }
        public async Task<Pagination<MediaEntitie>> GetMedia(int pageIndex, int pageSize) => await _mediaRepository.GetMedia(pageIndex, pageSize);
        private string GetFileName(string extension)
        {
            return $"{Guid.NewGuid()}{extension}";
        }
        private async Task<string> SaveAsync(Stream stream, string fileName, CancellationToken cancellationToken)
        {
            Directory.CreateDirectory("C:\\Users\\Marden\\Desktop\\ImagenesProyecto");
            string fullPath = Path.Combine("C:\\Users\\Marden\\Desktop\\ImagenesProyecto", fileName);//pasar el appsettings
            await using var fileStream = new FileStream(
            fullPath,
            FileMode.CreateNew,
            FileAccess.Write,
            FileShare.None,
            bufferSize: 64 * 1024,
            useAsync: true);

            await stream.CopyToAsync(
            fileStream,
            cancellationToken);

            return fullPath;
        }
        private MediaEntitie CreateMediaEntitie(MediaRequest mediaRequest,string storagePath) 
        {
            var media = new MediaEntitie
            {
                Id = Guid.NewGuid(),
                StoragePath = storagePath,
                OriginalFileName = mediaRequest.File.FileName,
                ContentType = mediaRequest.File.ContentType,
                FileSize = mediaRequest.File.Length,
                Type = DetermineMediaType(mediaRequest.File.ContentType),
                UploadedAt = DateTimeOffset.UtcNow,
                state = 1
            };
            return media;
        }
        private static MediaType DetermineMediaType(string contentType) =>
        contentType?.ToLowerInvariant() switch
        {
        var type when contentType.StartsWith("image/") => MediaType.Image,
        var type when contentType.StartsWith("video/") => MediaType.Video,
        var type when contentType.StartsWith("audio/") => MediaType.Audio,
        var type when contentType.StartsWith("application/") ||
                     contentType.StartsWith("text/") => MediaType.Document,
        _ => MediaType.Other
        };

        public async Task<Guid> DeleteMedia(Guid idMedia)
        {
            await _mediaRepository.DeleteMedia(idMedia);
            return idMedia;
        }

        public async Task<bool> SetFavorite(Guid idMedia, bool isFavorite) => await _mediaRepository.SetFavorite(idMedia, isFavorite);

        public async Task<Pagination<MediaEntitie>> GetFavorites(int pageIndex, int pageSize) => await _mediaRepository.GetFavorites(pageIndex, pageSize);

        public async Task<Pagination<MediaEntitie>> FilterMedia(MediaFilterRequest filter) => await _mediaRepository.FilterMedia(filter);

        public async Task<Pagination<MediaEntitie>> GetTrash(int pageIndex, int pageSize) => await _mediaRepository.GetTrash(pageIndex, pageSize);

        public async Task<bool> RecoverMedia(Guid idMedia) => await _mediaRepository.RecoverMedia(idMedia);
    }


}