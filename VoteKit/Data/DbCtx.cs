using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VoteKit.Data.Models;

namespace VoteKit.Data;

public class VotekitCtx : DbContext
{
  public static readonly ILoggerFactory MyLoggerFactory
    = LoggerFactory.Create(builder => { builder.AddConsole(); });

  public VotekitCtx(DbContextOptions options) : base(options)
  {
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
  }

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    optionsBuilder
      //.EnableSensitiveDataLogging()
      //.UseModel(Compiled.VotekitCtxModel.Instance)
      //.UseLoggerFactory(MyLoggerFactory)
      .AddInterceptors(new EntrySaveChangesInterceptor());
  }

  public async Task<int> SaveChangesWithValidationAsync()
  {
    var recordsToValidate = ChangeTracker.Entries().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified)
      .Select(e => e.Entity);

    foreach (var entity in recordsToValidate)
    {
      var validationContext = new ValidationContext(entity);
      var results = new List<ValidationResult>();

      if (!Validator.TryValidateObject(entity, validationContext, results, true))
      {
        var messages = results.Select(r => r.ErrorMessage ?? "").ToList().Aggregate((message, nextMessage) => message + "\n" + nextMessage);
        throw new ValidationException(messages);
      }
    }

    return await SaveChangesAsync();
  }

  public DbSet<Activity> Activities => Set<Activity>();
  public DbSet<Project> Projects => Set<Project>();
  public DbSet<Board> Boards => Set<Board>();
  public DbSet<Status> Statuses => Set<Status>();
  public DbSet<Field> Fields => Set<Field>();
  public DbSet<FieldOption> FieldOptions => Set<FieldOption>();
  public DbSet<Image> Images => Set<Image>();
  public DbSet<Entry> Entries => Set<Entry>();
  public DbSet<EntryField> EntryFields => Set<EntryField>();
  public DbSet<EntryVote> EntryVotes => Set<EntryVote>();
  public DbSet<EntrySubscription> EntrySubscriptions => Set<EntrySubscription>();
  public DbSet<EntrySlug> EntrySlugs => Set<EntrySlug>();
  public DbSet<User> Users => Set<User>();
  public DbSet<Comment> Comments => Set<Comment>();
  public DbSet<CommentLike> CommentLikes => Set<CommentLike>();
  public DbSet<Invite> Invites => Set<Invite>();
  public DbSet<DataProtectionKey> DataProtectionKeys => Set<DataProtectionKey>();
  public DbSet<SsoConfig> SsoConfigs => Set<SsoConfig>();

  public ValueTask<T?> Get<T>(object id) where T : class
  {
    return Set<T>().FindAsync(id);
  }
}

public class ValidationException : VoteKitException
{
  public ValidationException(string message) : base(message, "VALIDATION_FAILED")
  {
  }
}
