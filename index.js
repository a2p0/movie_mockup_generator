import { env } from "./env"
import { Configuration, OpenAIApi } from "openai"


const configuration = new Configuration({
  apiKey: env.openai.API_KEY
})
const openai = new OpenAIApi(configuration)

const setupTextarea = document.getElementById('setup-textarea') 
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')

document.getElementById("send-btn").addEventListener("click", () => {
  const pitcherPrompt = setupTextarea.value
  if (pitcherPrompt) {
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
    fetchBotReply(pitcherPrompt)
    fetchSynopsis(pitcherPrompt)
  }
})

async function fetchBotReply(pitcherPrompt) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate a short message to enthusiastically say a pitcher prompt sounds interesting and that you need some minutes to think about it.
    ###
    pitcher_prompt: Two dogs fall in love and move to Hawaii to learn to surf.
    short_message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
    ###
    pitcher_prompt: A plane crashes in the jungle and the passengers have to walk 1000km to safety.
    short_message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
    ###
    pitcher_prompt: A group of corrupt lawyers try to send an innocent woman to jail.
    short_message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
    ###
    pitcher_prompt: ${pitcherPrompt}
    short_message: 
    `,
    max_tokens: 60
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
}

async function fetchSynopsis(pitcherPrompt) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate an engaging, professional and marketable movie synopsis based on a pitcher prompt. Also think about the best suitable actors for the roles you may mention in the synopsis and put the actor's name between parentheses rigth after the charachter name.
    ###
    pitcher_prompt: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
    ###
    pitcher_prompt: ${pitcherPrompt}
    synopsis: `,
    max_tokens: 500
  })
  const synopsis = response.data.choices[0].text.trim()
  movieBossText.innerText = synopsis
  fetchTitle(synopsis)
  fetchActors(synopsis)
}

async function fetchTitle(synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate a catchy movie title based on this ${synopsis}.`,
    max_tokens: 16,
    temperature: 0.7
  })
  const title = response.data.choices[0].text.trim()
  document.getElementById('output-title').innerText = title
  fetchImagePrompt(title, synopsis)
}

async function fetchActors(synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
/*
Challenge:
    1. Use OpenAI to extra the names in brackets from our synopsis.
*/
    prompt: `Extract the names in parentheses in the synopsis.
    ###
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
    actors: Tom Cruise, Val Kilmer, Kelly McGillis
    ###
    synopsis: ${synopsis}
    actors: 
    `,
    max_tokens: 30
  })
  document.getElementById('output-stars').innerText = response.data.choices[0].text.trim()
}
async function fetchImagePrompt(title, synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `
    Write a image description for Dall-E to generate a advertising movie poster based on the title and the synopsis. Give the image the most suitable style based on the synopsis. The image should have rich visual details. 
    ###
    title: Love's Time Warp
    synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through the ages.
    image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
    ###
    title: zero Earth
    synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), Kob embarks on a perilous mission to destroy Simm. Along the way, he discovers a newfound courage and strength as he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien lord and save the planet.
    image-description: A tired and bloodied bodyguard and hamster standing atop a tall skyscraper, looking out over a vibrant cityscape, with a rainbow in the sky above them.
    ###
    title: ${title}
    synopsis: ${synopsis}
    image description: `,
    temperature: 0.8,    
    max_tokens: 100    
  })
  console.log(response.data.choices[0].text.trim())
}


