﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using app_server.Models;

#nullable disable

namespace app_server.Migrations
{
    [DbContext(typeof(StudentsRegisterContext))]
    [Migration("20240401182232_AddStudentUniqueIdCode")]
    partial class AddStudentUniqueIdCode
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("app_server.Models.Assignment", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<long?>("CourseId")
                        .HasColumnType("bigint");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DueDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CourseId");

                    b.ToTable("Assignments");
                });

            modelBuilder.Entity("app_server.Models.Course", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("EnrollmentKey")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Courses");
                });

            modelBuilder.Entity("app_server.Models.CourseTeacher", b =>
                {
                    b.Property<long>("TeacherId")
                        .HasColumnType("bigint");

                    b.Property<long>("CourseId")
                        .HasColumnType("bigint");

                    b.HasKey("TeacherId", "CourseId");

                    b.HasIndex("CourseId");

                    b.ToTable("CourseTeachers");
                });

            modelBuilder.Entity("app_server.Models.Enrollment", b =>
                {
                    b.Property<long>("StudentId")
                        .HasColumnType("bigint");

                    b.Property<long>("CourseId")
                        .HasColumnType("bigint");

                    b.HasKey("StudentId", "CourseId");

                    b.HasIndex("CourseId");

                    b.ToTable("Enrollments");
                });

            modelBuilder.Entity("app_server.Models.Grade", b =>
                {
                    b.Property<long>("AssignmentId")
                        .HasColumnType("bigint");

                    b.Property<long>("StudentId")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("DateReceived")
                        .HasColumnType("datetime2");

                    b.Property<float>("Score")
                        .HasColumnType("real");

                    b.HasKey("AssignmentId", "StudentId");

                    b.HasIndex("StudentId");

                    b.ToTable("Grades");
                });

            modelBuilder.Entity("app_server.Models.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserType")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.UseTptMappingStrategy();
                });

            modelBuilder.Entity("app_server.Models.UserPreference", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.HasKey("Id");

                    b.ToTable("UserPreferences");
                });

            modelBuilder.Entity("app_server.Models.Student", b =>
                {
                    b.HasBaseType("app_server.Models.User");

                    b.Property<string>("Nickname")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("UniqueIdentificationCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<long>("UserPreferencesId")
                        .HasColumnType("bigint");

                    b.HasIndex("Nickname")
                        .IsUnique()
                        .HasFilter("[Nickname] IS NOT NULL");

                    b.HasIndex("UniqueIdentificationCode")
                        .IsUnique()
                        .HasFilter("[UniqueIdentificationCode] IS NOT NULL");

                    b.HasIndex("UserPreferencesId")
                        .IsUnique()
                        .HasFilter("[UserPreferencesId] IS NOT NULL");

                    b.ToTable("Students", (string)null);
                });

            modelBuilder.Entity("app_server.Models.Teacher", b =>
                {
                    b.HasBaseType("app_server.Models.User");

                    b.ToTable("Teachers", (string)null);
                });

            modelBuilder.Entity("app_server.Models.Assignment", b =>
                {
                    b.HasOne("app_server.Models.Course", null)
                        .WithMany("Assignments")
                        .HasForeignKey("CourseId");
                });

            modelBuilder.Entity("app_server.Models.CourseTeacher", b =>
                {
                    b.HasOne("app_server.Models.Course", "Course")
                        .WithMany()
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("app_server.Models.Teacher", "Teacher")
                        .WithMany()
                        .HasForeignKey("TeacherId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Course");

                    b.Navigation("Teacher");
                });

            modelBuilder.Entity("app_server.Models.Enrollment", b =>
                {
                    b.HasOne("app_server.Models.Course", "Course")
                        .WithMany()
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("app_server.Models.Student", "Student")
                        .WithMany()
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Course");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("app_server.Models.Grade", b =>
                {
                    b.HasOne("app_server.Models.Assignment", "Assignment")
                        .WithMany("Grades")
                        .HasForeignKey("AssignmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("app_server.Models.Student", "Student")
                        .WithMany("Grades")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Assignment");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("app_server.Models.Student", b =>
                {
                    b.HasOne("app_server.Models.User", null)
                        .WithOne()
                        .HasForeignKey("app_server.Models.Student", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("app_server.Models.UserPreference", "UserPreferences")
                        .WithOne("Student")
                        .HasForeignKey("app_server.Models.Student", "UserPreferencesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserPreferences");
                });

            modelBuilder.Entity("app_server.Models.Teacher", b =>
                {
                    b.HasOne("app_server.Models.User", null)
                        .WithOne()
                        .HasForeignKey("app_server.Models.Teacher", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("app_server.Models.Assignment", b =>
                {
                    b.Navigation("Grades");
                });

            modelBuilder.Entity("app_server.Models.Course", b =>
                {
                    b.Navigation("Assignments");
                });

            modelBuilder.Entity("app_server.Models.UserPreference", b =>
                {
                    b.Navigation("Student");
                });

            modelBuilder.Entity("app_server.Models.Student", b =>
                {
                    b.Navigation("Grades");
                });
#pragma warning restore 612, 618
        }
    }
}
