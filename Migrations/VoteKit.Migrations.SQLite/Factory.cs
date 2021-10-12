using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using VoteKit.Data;

namespace VoteKit.Migrations.SQLite
{
  public class SQLiteVotekitCtxFactory : IDesignTimeDbContextFactory<VotekitCtx>
  {
    public VotekitCtx CreateDbContext(string[] args)
    {
      return new VotekitCtx((new DbContextOptionsBuilder<VotekitCtx>()).UseSqlite(s => s.MigrationsAssembly("VoteKit.Migrations.SQLite")).Options);
    }
  }
}
