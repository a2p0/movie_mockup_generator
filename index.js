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
    prompt: `Generate a short message to enthusiastically say "${pitcherPrompt}" sounds interesting and that you need some minutes to think about it. Mention one aspect of the sentence.`,
    max_tokens: 60
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
}

async function fetchSynopsis(pitcherPrompt) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate an engaging, professional and marketable movie synopsis based on the following idea: ${pitcherPrompt}`,
    max_tokens: 500
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
}



