# TaskAI

TaskAI is an AI-powered assistant that helps you create a structured plan for completing tasks. Simply take a picture of what you're working on, add a few short keywords, and TaskAI will generate a detailed plan to help you stay organized and efficient.

<img src="https://i.imgur.com/KV1HCJ0.png" width="300">

## Features

- AI-powered task planning
- Capture images to enhance task descriptions
- Add short keywords to guide the AI
- Structured and detailed task breakdowns

## Installation

To set up and run TaskAI, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/WicherK/TaskAI.git
   ```
2. Navigate into the project folder:
   ```sh
   cd TaskAI
   ```
3. Install dependencies:
   ```sh
   npm -i
   ```

## Configuration

Before running the application, you need to provide an API key from OpenRouter. Create a `config.json` file in the root directory and add the following JSON structure:

```json
{
  "ID": "YOUR API KEY FROM OPENROUTER"
}
```

Replace `YOUR API KEY FROM OPENROUTER` with your actual API key to enable AI functionality.

## Usage

1. Start the application:
   ```sh
   npx expo start
   ```
2. Follow the on-screen instructions to:
   - Take a picture of the task you want to plan (optional, you can turn off camera).
   - Enter relevant keywords describing what you are doing.
   - Receive an AI-generated plan to accomplish your task efficiently.

## License

This project is licensed under the MIT License.

