export const URLStatus = ({ url }) => {
  return (
    <section className="flex justify-between gap-2">
      <article className="flex flex-col mb-4 mt-2 space-y-1 text-sm *:flex *:items-center *:space-x-2">
        <span className="">
          {
            new Date(url.expirationDate) < new Date()
              ? <span className='px-2 py-.5 font-bold rounded-lg bg-red-400/20 small-caps text-red-500/80'>Expired</span>
              : <span><b>Expiration: </b> <span className="text-muted-foreground">
                {isNaN(new Date(url.expirationDate).getTime())
                  ? "Not set"
                  : new Date(url.expirationDate).toLocaleString()}</span>
              </span>
          }
        </span>
        <span className="">
          {
            new Date(url.scheduledDate) <= new Date()
              ? <span className='px-2 py-.5 mt-1 font-bold rounded-lg bg-green-400/20 small-caps text-green-500/80'>Live</span>
              : <span><b>Scheduled: </b><span class="text-muted-foreground">{new Date(url.scheduledDate).toLocaleString()}</span></span>
          }
        </span>
      </article>
      <aside>
      </aside>
    </section>
  )
}

