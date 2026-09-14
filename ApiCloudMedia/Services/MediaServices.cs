using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using System;
using System.IO;
using System.IO.Pipelines;
using System.Threading;
using System.Threading.Tasks;
namespace Services
{
    public class MediaServices : IMediaServices
    {
        public MediaServices() { }
        public async Task<Guid> SaveMediaAsync(MediaRequest mediaRequest, CancellationToken cancellationToken)
        {
            var file = mediaRequest.File;
            string fileName = GetFileName(Path.GetExtension(file.FileName));

            using var stream = file.OpenReadStream();
            var storagePath = await SaveAsync(
            stream,
            fileName,
            cancellationToken);

            throw new NotImplementedException();
        }
        private string GetFileName(string extension)
        {
            return $"{Guid.NewGuid()}{extension}";
        }
        private async Task<string> SaveAsync(Stream stream, string fileName, CancellationToken cancellationToken)
        {
            string fullPath = Path.Combine("ruta", fileName);
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

            return storagePath;
        }
    }
    

}
