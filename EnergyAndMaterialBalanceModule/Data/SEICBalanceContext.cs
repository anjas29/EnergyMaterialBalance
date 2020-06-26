using System;
using EnergyAndMaterialBalanceModule.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace EnergyAndMaterialBalanceModule.Data
{
    public partial class SEICBalanceContext : DbContext
    {
        public SEICBalanceContext()
        {
        }

        public SEICBalanceContext(DbContextOptions<SEICBalanceContext> options)
            : base(options)
        {
        }

        public virtual DbSet<BalanceClosed> BalanceClosed { get; set; }
        public virtual DbSet<BalanceClosedTemp> BalanceClosedTemp { get; set; }
        public virtual DbSet<Bgroups> Bgroups { get; set; }
        public virtual DbSet<Bgroups1> Bgroups1 { get; set; }
        public virtual DbSet<BgroupsAaQuality> BgroupsAaQuality { get; set; }
        public virtual DbSet<Periods> Periods { get; set; }
        public virtual DbSet<Points> Points { get; set; }
        public virtual DbSet<Prule> Prule { get; set; }
        public virtual DbSet<ReportTypes> ReportTypes { get; set; }
        public virtual DbSet<Resources> Resources { get; set; }
        public virtual DbSet<Rules> Rules { get; set; }
        public virtual DbSet<Seicmask1h> Seicmask1h { get; set; }
        public virtual DbSet<Seicmask2h> Seicmask2h { get; set; }
        public virtual DbSet<Seicmask30m> Seicmask30m { get; set; }
        public virtual DbSet<Seicmask5m> Seicmask5m { get; set; }
        public virtual DbSet<Sources> Sources { get; set; }
        public virtual DbSet<UserActions> UserActions { get; set; }
        public virtual DbSet<VBgroups> VBgroups { get; set; }
        public virtual DbSet<SeicVMappingHistorian> SeicVMappingHistorian { get; set; }
        public virtual DbSet<SeicVMappingIteh> SeicVMappingIteh { get; set; }
        public virtual DbSet<SeicVMappingManual> SeicVMappingManual { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("SEICBalanceConnection");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BalanceClosed>(entity =>
            {
                entity.HasKey(e => new { e.BgroupId, e.TagName, e.P });

                entity.Property(e => e.BgroupId).HasColumnName("BGroupID");

                entity.Property(e => e.TagName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.P).HasColumnType("smalldatetime");

                entity.Property(e => e.BgroupIdparent).HasColumnName("BGroupIDParent");

                entity.Property(e => e.BgroupName)
                    .HasColumnName("BGroupName")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.DateClosed).HasColumnType("datetime");

                entity.Property(e => e.Direction)
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.Period).HasColumnType("smalldatetime");

                entity.Property(e => e.PointName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.SourceId).HasColumnName("SourceID");

                entity.Property(e => e.TimeStamp)
                    .HasColumnName("Time_Stamp")
                    .HasColumnType("datetime");

                entity.Property(e => e.TimeStampMs).HasColumnName("Time_Stamp_ms");

                entity.Property(e => e.UserName)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<BalanceClosedTemp>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("BalanceClosed_temp");

                entity.Property(e => e.BgroupId).HasColumnName("BGroupID");

                entity.Property(e => e.BgroupIdparent).HasColumnName("BGroupIDParent");

                entity.Property(e => e.BgroupName)
                    .HasColumnName("BGroupName")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.DateClosed).HasColumnType("datetime");

                entity.Property(e => e.Direction)
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.P).HasColumnType("smalldatetime");

                entity.Property(e => e.Period).HasColumnType("smalldatetime");

                entity.Property(e => e.PointName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.SourceId).HasColumnName("SourceID");

                entity.Property(e => e.TagName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp)
                    .HasColumnName("Time_Stamp")
                    .HasColumnType("datetime");

                entity.Property(e => e.TimeStampMs).HasColumnName("Time_Stamp_ms");

                entity.Property(e => e.UserName)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Bgroups>(entity =>
            {
                entity.HasKey(e => e.BgroupId);

                entity.ToTable("BGroups");

                entity.Property(e => e.BgroupId).HasColumnName("BGroupID");

                entity.Property(e => e.BgroupIdparent).HasColumnName("BGroupIDParent");

                entity.Property(e => e.BgroupName)
                    .HasColumnName("BGroupName")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ResourceId).HasColumnName("ResourceID");

                entity.HasOne(d => d.BgroupIdparentNavigation)
                    .WithMany(p => p.InverseBgroupIdparentNavigation)
                    .HasForeignKey(d => d.BgroupIdparent)
                    .HasConstraintName("FK_BGroups_BGroups");

                entity.HasOne(d => d.Resource)
                    .WithMany(p => p.Bgroups)
                    .HasForeignKey(d => d.ResourceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BGroups_Resources");
            });

            modelBuilder.Entity<Bgroups1>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("BGroups1");

                entity.Property(e => e.Header)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.ParentId).HasColumnName("ParentID");

                entity.Property(e => e.ResourceId).HasColumnName("ResourceID");
            });

            modelBuilder.Entity<BgroupsAaQuality>(entity =>
            {
                entity.HasKey(e => new { e.QualityTableIdentity, e.ColumnName })
                    .HasName("PK_dbo.BGroups_aaQuality");

                entity.ToTable("BGroups_aaQuality");

                entity.Property(e => e.ColumnName).HasMaxLength(128);

                entity.Property(e => e.Timestamp).HasColumnType("datetime");

                entity.HasOne(d => d.QualityTableIdentityNavigation)
                    .WithMany(p => p.BgroupsAaQuality)
                    .HasForeignKey(d => d.QualityTableIdentity)
                    .HasConstraintName("FK_dbo.BGroups");
            });

            modelBuilder.Entity<Periods>(entity =>
            {
                entity.HasKey(e => e.PeriodId);

                entity.Property(e => e.PeriodId)
                    .HasColumnName("PeriodID")
                    .ValueGeneratedNever();

                entity.Property(e => e.PeriodName)
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Points>(entity =>
            {
                entity.HasKey(e => e.PointId);

                entity.Property(e => e.PointId).HasColumnName("PointID");

                entity.Property(e => e.BgroupId).HasColumnName("BGroupID");

                entity.Property(e => e.Direction)
                    .IsRequired()
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.PeriodId).HasColumnName("PeriodID");

                entity.Property(e => e.PointName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SourceId).HasColumnName("SourceID");

                entity.Property(e => e.Tagname)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.Bgroup)
                    .WithMany(p => p.Points)
                    .HasForeignKey(d => d.BgroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Points_BGroups");

                entity.HasOne(d => d.Period)
                    .WithMany(p => p.Points)
                    .HasForeignKey(d => d.PeriodId)
                    .HasConstraintName("FK_Points_Periods");

                entity.HasOne(d => d.Source)
                    .WithMany(p => p.Points)
                    .HasForeignKey(d => d.SourceId)
                    .HasConstraintName("FK_Points_Sources");
            });

            modelBuilder.Entity<Prule>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("PRule");

                entity.Property(e => e.Param)
                    .HasMaxLength(3)
                    .IsUnicode(false);

                entity.Property(e => e.RuleId).HasColumnName("RuleID");

                entity.Property(e => e.SourceId).HasColumnName("SourceID");

                entity.Property(e => e.TagName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.Rule)
                    .WithMany()
                    .HasForeignKey(d => d.RuleId)
                    .HasConstraintName("FK_PRule_Rules");

                entity.HasOne(d => d.Source)
                    .WithMany()
                    .HasForeignKey(d => d.SourceId)
                    .HasConstraintName("FK_PRule_Sources");
            });

            modelBuilder.Entity<ReportTypes>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.ReportName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ReportTemplName)
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Resources>(entity =>
            {
                entity.HasKey(e => e.ResourceId);

                entity.Property(e => e.ResourceId)
                    .HasColumnName("ResourceID")
                    .ValueGeneratedNever();

                entity.Property(e => e.ResourceName)
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Rules>(entity =>
            {
                entity.HasKey(e => e.RuleId);

                entity.Property(e => e.RuleId).HasColumnName("RuleID");

                entity.Property(e => e.Formula)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.PointId).HasColumnName("PointID");

                entity.HasOne(d => d.Point)
                    .WithMany(p => p.Rules)
                    .HasForeignKey(d => d.PointId)
                    .HasConstraintName("FK_Rules_Points");
            });

            modelBuilder.Entity<Seicmask1h>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("SEICMask1h");
            });

            modelBuilder.Entity<Seicmask2h>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("SEICMask2h");
            });

            modelBuilder.Entity<Seicmask30m>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("SEICMask30m");
            });

            modelBuilder.Entity<Seicmask5m>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("SEICMask5m");
            });

            modelBuilder.Entity<Sources>(entity =>
            {
                entity.HasKey(e => e.SourceId);

                entity.Property(e => e.SourceId)
                    .HasColumnName("SourceID")
                    .ValueGeneratedNever();

                entity.Property(e => e.SourceName)
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UserActions>(entity =>
            {
                entity.HasNoKey();

                entity.HasIndex(e => e.Dt)
                    .HasName("NonClusteredIndex-20200507-123919");

                entity.Property(e => e.Comment)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Dt)
                    .HasColumnName("DT")
                    .HasColumnType("datetime");

                entity.Property(e => e.TableName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserName)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<VBgroups>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("v_BGroups");

                entity.Property(e => e.BgroupId).HasColumnName("BGroupID");

                entity.Property(e => e.BgroupIdparent).HasColumnName("BGroupIDParent");

                entity.Property(e => e.BgroupName)
                    .HasColumnName("BGroupName")
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ResourceId).HasColumnName("ResourceID");
            });

            modelBuilder.Entity<SeicVMappingHistorian>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("SEIC_v_MappingHistorian");

                entity.Property(e => e.Description).HasMaxLength(512);

                entity.Property(e => e.TagName)
                    .IsRequired()
                    .HasMaxLength(256);
            });

            modelBuilder.Entity<SeicVMappingIteh>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("SEIC_v_MappingITEH");

                entity.Property(e => e.Dbname)
                    .IsRequired()
                    .HasColumnName("DBName")
                    .HasMaxLength(6)
                    .IsUnicode(false);

                entity.Property(e => e.Lsname)
                    .IsRequired()
                    .HasColumnName("LSName")
                    .HasMaxLength(6)
                    .IsUnicode(false);

                entity.Property(e => e.TableName)
                    .IsRequired()
                    .HasMaxLength(16)
                    .IsUnicode(false);

                entity.Property(e => e.TagName)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SeicVMappingManual>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("SEIC_v_MappingManual");

                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.TagName)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });



            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
