using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repository.Migrations
{
    /// <inheritdoc />
    public partial class NewMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlbumMedia_Album_AlbumEntityidAlbum",
                table: "AlbumMedia");

            migrationBuilder.DropIndex(
                name: "IX_AlbumMedia_AlbumEntityidAlbum",
                table: "AlbumMedia");

            migrationBuilder.DropColumn(
                name: "AlbumEntityidAlbum",
                table: "AlbumMedia");

            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "Media",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_AlbumMedia_idAlbum",
                table: "AlbumMedia",
                column: "idAlbum");

            migrationBuilder.CreateIndex(
                name: "IX_AlbumMedia_IdMedia",
                table: "AlbumMedia",
                column: "IdMedia");

            migrationBuilder.AddForeignKey(
                name: "FK_AlbumMedia_Album_idAlbum",
                table: "AlbumMedia",
                column: "idAlbum",
                principalTable: "Album",
                principalColumn: "idAlbum",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AlbumMedia_Media_IdMedia",
                table: "AlbumMedia",
                column: "IdMedia",
                principalTable: "Media",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlbumMedia_Album_idAlbum",
                table: "AlbumMedia");

            migrationBuilder.DropForeignKey(
                name: "FK_AlbumMedia_Media_IdMedia",
                table: "AlbumMedia");

            migrationBuilder.DropIndex(
                name: "IX_AlbumMedia_idAlbum",
                table: "AlbumMedia");

            migrationBuilder.DropIndex(
                name: "IX_AlbumMedia_IdMedia",
                table: "AlbumMedia");

            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "Media");

            migrationBuilder.AddColumn<Guid>(
                name: "AlbumEntityidAlbum",
                table: "AlbumMedia",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AlbumMedia_AlbumEntityidAlbum",
                table: "AlbumMedia",
                column: "AlbumEntityidAlbum");

            migrationBuilder.AddForeignKey(
                name: "FK_AlbumMedia_Album_AlbumEntityidAlbum",
                table: "AlbumMedia",
                column: "AlbumEntityidAlbum",
                principalTable: "Album",
                principalColumn: "idAlbum");
        }
    }
}
