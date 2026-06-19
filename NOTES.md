> a. How you interpreted the brief and any assumptions you made where it
> was ambiguous
I assumed the theme provided was not to be recreated exactly but only to provide inspiration/starting point
Movies watched can be kept track in localStorage as we're assuming same browser, same computer

> b. How you chose to architect the project and why
Use of tanstack query - already had familiarity with tool and was brought in by the initial generation + dev experience
Only client side - I'm more familiar with purely client side react rather than SSR. It more came down for a concern of the implementation of the search keyword feature. Although you can definitely argue there's some performance left on the table because of not using SSR
LocalStorage - given time constraints and the assumption that a user will be using same browser, same computer I was able to use localStorage for movies watched. This simplifies things as we don't need a backend or auth service.
TailwindCSS - a hold over from the initial generation with lovable


> c. How you used AI tools (e.g. Cursor, Copilot) during the build — be
> specific about what you prompted it to do, where it helped, and where
> you had to correct or override it
The initial first pass was done with lovable. However the free tier does not provide a lot of credits
so after digging into the tech stack a little I found out it built the initial app with tanstack start and not nextjs.
I then pulled it down and mostly converted it to nextjs with claude, however I had to do so more correcting manually to get it to
a state that I liked. (A small thing to note is that I found the api key for the tmdb database hardcoded either though lovable said it would "store it securely within lovable cloud")

The two features of marked movies as watched and a link off to IMDB page were essentially built with Claude. For the marking movies as watched I already knew I wanted them in localStorage and so gave claude direction in that regard. For the imdb link I had the particular endpoint picked out where I could get the id and decided it would make sense in a modal popup (as we couldn't get the id in one pass from the discover endpoint)

> d. Anything you would do differently or add given more time
I unfortunately ran out of time to implement the keyword search feature. It should just be a matter of
appending it to the query from the search box and displaying the results. I would also liked to separate out the
movie modal from the movies list and put the movie queries/api into their own api file and query files respectively.
Investigate nextjs image optimisation