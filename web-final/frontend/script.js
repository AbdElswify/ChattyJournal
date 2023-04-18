class PersonalityBot {
  constructor() {
    this.isFetching = false; // track whether a request is already being fetched
    this.fetchTimeout = null; // track the timeout so we can clear it if needed

    const form = document.querySelector('#new-entry-form');
    form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    // If we're already fetching a response, don't fetch again until we're done.
    if (this.isFetching) {
      return;
    }

    const message = document.querySelector('#entry-message').value;
    const personality = document.querySelector('#personality').value;

    this.isFetching = true;

    fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
      },
      body: JSON.stringify({
        prompt: `You are a ${personality} chatbot. A user passes an inputted ${message}. Respond to the user with a ${personality} tone, mannerism, and behavior. Be sure to remember previous api calls for context.`,
        temperature: 0.7,
        max_tokens: 60,
      }),
    })
      .then(response => {
        if (!response.ok) {
          const botResponseContainer = document.querySelector('#bot-response');
          botResponseContainer.textContent = "Bot Response: I apologize, Im a bit tired right now, and really need some rest. Come back later and I will respond.";
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const botResponse = data.choices[0].text;
        const botResponseContainer = document.querySelector('#bot-response');
        botResponseContainer.textContent = "Bot Response: " + botResponse;

        const userInput = document.querySelector('#entry-message');
  userInput.value = '';
      })
      .catch(error => console.error(error))
      .finally(() => {
        // Allow fetching the next response after a delay of 2 seconds.
        this.fetchTimeout = setTimeout(() => {
          this.isFetching = false;
          this.fetchTimeout = null;
        }, 2000);
      });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const bot = new PersonalityBot();
});
