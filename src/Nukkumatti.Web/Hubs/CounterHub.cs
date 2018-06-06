using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Nukkumatti.Web.Data;
using Nukkumatti.Web.Data.Entities;

namespace Nukkumatti.Web.Hubs
{
    public class CounterHub : Hub
    {
        private readonly NukkumattiDbContext _context;

        public CounterHub(NukkumattiDbContext context)
        {
            _context = context;
        }

        public async Task Increment(int amount)
        {
            var latestSituation = await _context.Situations.LastOrDefaultAsync();
            if (latestSituation == null)
            {
                await UpdateSituationAsync(EventType.Increment, 0);
            }
            else
            {
                await UpdateSituationAsync(EventType.Increment, latestSituation.Count + amount);
            }
        }

        public async Task Decrement(int amount)
        {
            var latestSituation = await _context.Situations.LastOrDefaultAsync();
            if (latestSituation == null)
            {
                await UpdateSituationAsync(EventType.Decrement, 0);
            }
            else
            {
                var newCount = latestSituation.Count - amount;
                await UpdateSituationAsync(EventType.Decrement, newCount > 0 ? newCount : 0);
            }
        }

        public override async Task OnConnectedAsync()
        {
            var situation = await _context.Situations.LastOrDefaultAsync();
            await Clients.Caller.SendAsync("Update", situation?.Count ?? 0);
            await base.OnConnectedAsync();
        }

        private async Task UpdateSituationAsync(EventType type, int count)
        {
            var currentSituation = new Situation
            {
                Count = count,
                LastEventType = type,
                Time = DateTime.UtcNow
            };
            var result = await _context.Situations.AddAsync(currentSituation);
            await _context.SaveChangesAsync();
            await Clients.All.SendAsync("Update", result.Entity.Count);
        }
    }
}