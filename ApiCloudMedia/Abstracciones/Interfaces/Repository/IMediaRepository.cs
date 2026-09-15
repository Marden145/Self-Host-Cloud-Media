using Abstracciones.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Abstracciones.Interfaces.Repository
{
    public interface IMediaRepository
    {
        Task AddMedia(MediaEntitie mediaEntity);
        Task<IEnumerable<MediaEntitie>> GetMedia();
    }
}
