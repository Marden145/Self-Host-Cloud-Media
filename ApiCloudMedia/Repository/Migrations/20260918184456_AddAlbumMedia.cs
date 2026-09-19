using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddAlbumMedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Album",
                columns: table => new
                {
                    idAlbum = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    State = table.Column<int>(type: "int", nullable: false),
                    CoverMediaId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Album", x => x.idAlbum);
                });

            migrationBuilder.CreateTable(
                name: "AlbumMedia",
                columns: table => new
                {
                    idAlbumMedia = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAlbum = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdMedia = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    State = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AlbumEntityidAlbum = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlbumMedia", x => x.idAlbumMedia);
                    table.ForeignKey(
                        name: "FK_AlbumMedia_Album_AlbumEntityidAlbum",
                        column: x => x.AlbumEntityidAlbum,
                        principalTable: "Album",
                        principalColumn: "idAlbum");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlbumMedia_AlbumEntityidAlbum",
                table: "AlbumMedia",
                column: "AlbumEntityidAlbum");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlbumMedia");

            migrationBuilder.DropTable(
                name: "Album");
        }
    }
}
