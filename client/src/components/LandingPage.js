import './LandingPage.css'

export default function LandingPage() {
  return(
    <div className="LandingPage">
      <h1>Inspiration</h1>
      <p>
        The world witnessed a historic shift in the 2020 job market due to the Covid-19 pandemic. While some companies used to offer the ability to work from home as a perk, it has now become the norm for most businesses. By 2025, an estimated 70% of the workforce will be working remotely at least five days a month. While 2020 may be considered the year of remote work, it is just the beginning as we see the trend continuing in 2021. 
      </p>
      <p>
        Due to the high demand of remote jobs, lots of companies have been started. Their sole job is to find skilled individuals and match them to different jobs & employers. Some of the popular companies are Crossover, Turning & Toptal etc. Now, the issue with these sites is that a person has to pass multiple tests in order to prove their skills. Let's say someone has applied at 10 different such companies, they would have to pass the same skill tests multiple times. This not only wastes time & is a very frustrating experience for the candidate.
      </p>
      <h2>What it does?</h2>
      <p>
        Soul-XP allows candidates to request soulbound-tokens from the remote hiring companies for the tests they have already passed. The company can either accept or reject the request based on its validity. Later, candidates can use this soulbound-token to prove their skills to another company. The other company can verify whether the soulbound-token is valid and is from the said organization or not.
      </p>
      <h2>How I built it</h2>
      <p>
        Soul-XP uses the idea of Souls as described by the Vitalik in his research paper. Each skill passed is a soul that is bound to the Ethereum address of the candidate. It cannot be transferred or destroyed (though it can be revoked by the company). 
      </p>
      <h2>What's next for Soul-XP?</h2>
      <p>
        To extend Soul-XP application to support features such as recovering the souls that are bound to a lost wallet. Allowing the issuing company to revoke the access to the issue soul. 
      </p>
    </div>
  )
}
