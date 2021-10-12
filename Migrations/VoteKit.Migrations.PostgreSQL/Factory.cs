using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using VoteKit.Data;

namespace VoteKit.Migrations.PostgreSQL
{
  public class PostgreSQLVotekitCtxFactory : IDesignTimeDbContextFactory<VotekitCtx>
  {
    public VotekitCtx CreateDbContext(string[] args)
    {
      return new VotekitCtx((new DbContextOptionsBuilder<VotekitCtx>()).UseNpgsql(s => s.MigrationsAssembly("VoteKit.Migrations.PostgreSQL")).Options);
    }
  }
}
