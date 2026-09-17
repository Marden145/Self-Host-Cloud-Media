using Abstracciones.Entities;
using Abstracciones.Interfaces.Repository;
using Abstracciones.Interfaces.Services;
using Google.Apis.Auth;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services
{
    public class UserServices : IUserServices
    {
        private readonly IUserRepository _userRepository;
        public UserServices(IUserRepository userRepository) => _userRepository = userRepository;
        public async Task<string> LoginWithGoogle(string idToken)
        {
            var googleUser = await ValidateAsync(idToken);
            var user = await _userRepository.GetUserByEmail(googleUser.Email);
            if(user is null)
            {
                await _userRepository.CreateUserAsync(new UserEntity
                {
                    Id=Guid.NewGuid(),
                    FirstName= googleUser.GivenName,
                    LastName = googleUser.FamilyName,
                    Email = googleUser.Email,
                    Provider = "Google"
                });
                return "Usuario creado y logueado con Google";

            }
            else { return "ya existe este deveria ser el token"; }

        }

        private async Task<GoogleJsonWebSignature.Payload> ValidateAsync(string idToken)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { "97709341069-8qb7vben56nv8aurje2jugnfd23p36kt.apps.googleusercontent.com" }
            };
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            return payload;
        }

    }
}
