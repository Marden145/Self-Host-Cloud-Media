using Abstracciones.Interfaces.Services;
using Services;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Abstracciones.Interfaces.Repository;
using Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 1L * 1024 * 1024 * 1024;
});
builder.Services.AddControllers();
builder.Services.AddScoped<IMediaServices, MediaServices>();
builder.Services.AddScoped<IMediaRepository, MediaRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserServices, UserServices>();
builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
builder.Services.AddScoped<IAlbumServices, AlbumServices>();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<CloudMediaDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
