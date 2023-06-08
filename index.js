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
    prompt: `Generate an engaging, professional and marketable movie synopsis based on a pitcher prompt.
    ###
    pitcher_prompt: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
    ###
    pitcher_prompt: ${pitcherPrompt}
    synopsis: `,
    max_tokens: 500
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
}



