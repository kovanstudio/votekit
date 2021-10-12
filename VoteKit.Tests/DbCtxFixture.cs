using System;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using VoteKit.Data;
using VoteKit.Data.Models;

namespace VoteKit.Tests
{
  public class DbFixture : IDisposable
  {
    private readonly SqliteConnection _connection;
    private readonly VotekitCtx _db;

    public VotekitCtx Db => _db;

    public DbFixture()
    {
      _connection = new SqliteConnection("Filename=:memory:");
      _connection.Open();

      _db = new VotekitCtx(new DbContextOptionsBuilder<VotekitCtx>()
                .UseSqlite(_connection)
                .Options);

      _db.Database.EnsureCreated();

      Seed();
    }

    private void Seed()
    {
      var project = Project.Create("Test");
      var user = new User { ProjectId = project.Id, Email = "test@test.xyz", Password = "test" };

      _db.Projects.Add(project);
      _db.Users.Add(user);

      _db.SaveChanges();
    }

    public void Dispose()
    {
      _db.Dispose();
      _connection.Dispose();

      GC.SuppressFinalize(this);
    }
  }
}
