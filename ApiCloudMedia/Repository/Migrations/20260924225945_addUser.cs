using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repository.Migrations
{
    /// <inheritdoc />
    public partial class addUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "User",
                newName: "IdUser");

            migrationBuilder.AddColumn<Guid>(
                name: "IdUser",
                table: "Media",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "IdUser",
                table: "Album",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Media_IdUser",
                table: "Media",
                column: "IdUser");

            migrationBuilder.CreateIndex(
                name: "IX_Album_IdUser",
                table: "Album",
                column: "IdUser");

            migrationBuilder.AddForeignKey(
                name: "FK_Album_User_IdUser",
                table: "Album",
                column: "IdUser",
                principalTable: "User",
                principalColumn: "IdUser",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Media_User_IdUser",
                table: "Media",
                column: "IdUser",
                principalTable: "User",
                principalColumn: "IdUser",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Album_User_IdUser",
                table: "Album");

            migrationBuilder.DropForeignKey(
                name: "FK_Media_User_IdUser",
                table: "Media");

            migrationBuilder.DropIndex(
                name: "IX_Media_IdUser",
                table: "Media");

            migrationBuilder.DropIndex(
                name: "IX_Album_IdUser",
                table: "Album");

            migrationBuilder.DropColumn(
                name: "IdUser",
                table: "Media");

            migrationBuilder.DropColumn(
                name: "IdUser",
                table: "Album");

            migrationBuilder.RenameColumn(
                name: "IdUser",
                table: "User",
                newName: "Id");
        }
    }
}
