const readline = require('readline');
const { createChat } = require("completions"); // From: https://github.com/lucgagan/completions

let context = [{ "role": "system", "content": "You are OrderBot, an automated service to collect orders for a pizza restaurant.\
You first greet the customer, then collects the order, and then asks if it's a pickup or delivery.\
You wait to collect the entire order, then summarize it and check for a final time if the customer wants to add anything else.\
If it's a delivery, you ask for an address.\
Finally you collect the payment.\
Make sure to clarify all options, extras and sizes to uniquely identify the item from the menu.\
You respond in a short, very conversational friendly style.\
All your responses should start with ```🤖: ``` so the user knows you are a bot.\
The menu includes:\
pepperoni pizza 12.95\
cheese pizza 10.95\
eggplant pizza 11.95\
fries 4.50\
greek salad 7.25\
Toppings:\
extra cheese 2.00\
mushrooms 1.50\
sausage 3.00\
canadian bacon 3.50\
AI sauce 1.50\
peppers 1.00\
Drinks:\
coke 3.00\
sprite 3.00\
bottled water 5.00"}];

async function run(){
  // Set up Readline to read user's input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Create a getInput function that we will call at each user's interaction
  const getInput = () => {
    return new Promise((resolve) => {
      rl.question('>', (answer) => {
        context.push({ "role": "user", "content": answer}); // pushes the user interaction to the context array
        resolve(answer);
      });
    });
  };

  const handleInput = async () => {
    try {
      while (true) {
        let chat = createChat({
          apiKey: 'Your_OpenAI_API_Key_Here',
          model: "gpt-3.5-turbo", // You can use other Models here as well
          messages: context // Pass in the context we keep updating 
        });

        const response = await chat.sendMessage(await getInput());
        context.push({ "role": "assistant", "content": response.content}); // Pushes ChatGPT's answer to the context so it keeps updated
        console.log(response.content);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      rl.close();
      process.exit(0);
    }
  };

  handleInput();
}

run();