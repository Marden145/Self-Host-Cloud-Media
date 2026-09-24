using Abstracciones.Entities;
using Abstracciones.Interfaces.Repository;
using Abstracciones.Interfaces.Services;
using Abstracciones.Models;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Services
{
    public class UserServices : IUserServices
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        public UserServices(IUserRepository userRepository, IConfiguration configuration) 
        {
            _userRepository = userRepository;
            _configuration = configuration;

        }
        public async Task<Token> LoginWithGoogle(string idToken)
        {
            GoogleJsonWebSignature.Payload googleUser;
            try
            {
                googleUser = await ValidateAsync(idToken);
            }
            catch (InvalidJwtException)
            {
                return new Token { ValidacionExitosa = false };
            }
            UserEntity? user = await _userRepository.GetUserByEmail(googleUser.Email);
            if(user is null)
            {
                user = new UserEntity
                {
                    IdUser = Guid.NewGuid(),
                    FirstName = googleUser.GivenName,
                    LastName = googleUser.FamilyName,
                    Email = googleUser.Email,
                    Provider = "Google"
                };
                await _userRepository.CreateUserAsync(user);
            }
            return GenerateFinalToken(user);
        }

        private async Task<GoogleJsonWebSignature.Payload> ValidateAsync(string idToken)
        {
            GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { "97709341069-8qb7vben56nv8aurje2jugnfd23p36kt.apps.googleusercontent.com" }
            };
            GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            return payload;
        }
        private Token GenerateFinalToken(UserEntity usuario)
        {
            TokenConfiguracion tokenConfiguracion = _configuration.GetSection("Token").Get<TokenConfiguracion>()!;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenConfiguracion.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var expiresAt = DateTime.UtcNow.AddMinutes(tokenConfiguracion.Expires);

            var claims = GenerateClaims(usuario);

            var token = GenerateJwtToken(tokenConfiguracion, claims, expiresAt, credentials);

            return new Token
            {
                ValidacionExitosa = true,
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expiresAt,
                Correo = usuario.Email
            };
        }
        private List<Claim> GenerateClaims(UserEntity usuario) => new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("idUsuario", usuario.IdUser.ToString()),
            new("correoElectronico", usuario.Email),
            new("nombre", $"{usuario.FirstName} {usuario.LastName}")

        };
        private JwtSecurityToken GenerateJwtToken(TokenConfiguracion tokenConfiguracion, List<Claim> claims, DateTime expiresAt, SigningCredentials credentials) => new JwtSecurityToken(
                issuer: tokenConfiguracion.Issuer,
                audience: tokenConfiguracion.Audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials);
    }
}
