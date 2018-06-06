﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Nukkumatti.Web.Data;

namespace Nukkumatti.Web.Migrations
{
    [DbContext(typeof(NukkumattiDbContext))]
    partial class NukkumattiDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.1.0-rtm-30799")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("Nukkumatti.Web.Data.Entities.Situation", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("Count");

                    b.Property<int>("LastEventType");

                    b.Property<DateTime>("Time");

                    b.HasKey("Id");

                    b.ToTable("Situations");
                });
#pragma warning restore 612, 618
        }
    }
}
