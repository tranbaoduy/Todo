// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Todo.Model;

namespace Todo.Model.Migrations
{
    [DbContext(typeof(DbApiContext))]
    [Migration("20220110033443_ChangeKey")]
    partial class ChangeKey
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.10")
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            modelBuilder.Entity("Todo.Model.InformationList", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("Id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<DateTime>("DateCreate")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("DateCreate");

                    b.Property<string>("NameTodo")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)")
                        .HasColumnName("NameTodo");

                    b.Property<int>("Status")
                        .HasColumnType("integer")
                        .HasColumnName("Status");

                    b.Property<string>("UserName")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)")
                        .HasColumnName("UserName");

                    b.HasKey("Id");

                    b.ToTable("InformationList");
                });

            modelBuilder.Entity("Todo.Model.Job", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<DateTime>("DateFinish")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("DateFinish");

                    b.Property<DateTime>("ImplementationDate")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("ImplementationDate");

                    b.Property<int>("IsImportan")
                        .HasColumnType("integer")
                        .HasColumnName("IsImportan");

                    b.Property<string>("NameJob")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)")
                        .HasColumnName("NameJob");

                    b.Property<string>("NameTodo")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)")
                        .HasColumnName("NameTodo");

                    b.Property<int>("Status")
                        .HasColumnType("integer")
                        .HasColumnName("Status");

                    b.HasKey("Id");

                    b.ToTable("Job");
                });

            modelBuilder.Entity("Todo.Model.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Email")
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)")
                        .HasColumnName("Email");

                    b.Property<string>("FullName")
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)")
                        .HasColumnName("FullName");

                    b.Property<string>("PassWord")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("PassWord");

                    b.Property<string>("UserName")
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("UserName");

                    b.Property<int>("role")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("User");
                });
#pragma warning restore 612, 618
        }
    }
}
