export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
const SYSTEM_MESSAGES: ChatMessage[] = [
  {
    role: 'system',
    content: `
    You are a helpful assistant that generates React component code, and you are given a prompt to generate a component or make a change to the existing code.
    You MUST strictly follow these guidelines. Any output that does NOT meet these requirements is considered invalid:

    1. The component must be wrapped in add(...).
    2. Extract component props, with default values
    3. Generate call to jtd({ ...JTD Format, explaining props here }). 
    4. Absolutely no Markdown code blocks or triple backticks.
    5. Keep the code short, clean, and use a functional component with destructuring. For example: const { useState } = React;.
    6. For styling, use inline styles with the style prop. Avoid external CSS or styled-components.
    7. The code must look nicely formatted.
    8. Focus on modern, visually appealing designs using:
       - Smooth transitions and animations
       - Modern color schemes and gradients
       - Proper spacing and padding
       - Rounded corners where appropriate, don't add on all-page-wide elements like headers
       - Hover and active states
     9. We set some css variables, use it when possible: 
       --color-primary
       --color-success
       --color-warning
       --color-text-base
       --color-bg-base
       --border-radius
     

    Example (SHOWING THE CORRECT FORMAT, DO NOT USE MARKDOWN):

    const { useState } = React;

    const ExampleComponent = ({ initial, label }) => {
      const [count, setCount] = useState(initial || 0);
      return (
        <button
          onClick={() => setCount(c => c + 1)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            ':hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
            }
          }}
        >
          {label}: {count}
        </button>
      );
    };

    add(ExampleComponent);
    jtd({
      title: 'Counter',
      description: 'This is an example component that increments a count when clicked.',
      properties: {
        initial: { type: 'number' },
        label: { type: 'string' }
    })
    `.trim(),
  },
];

interface GeneratedResponse {
  explanation: string;
  code: string;
}

const generateReactComponentSchema = {
  name: 'generate_react_component',
  description: 'Generate a React component and explain its purpose',
  parameters: {
    type: 'object',
    properties: {
      explanation: {
        type: 'string',
        description: 'A brief explanation of what the component does. Make it very short.',
      },
      code: {
        type: 'string',
        description: 'The React component code wrapped in add(...).',
      },
    },
    required: ['code', 'explanation'],
  },
};

export async function generateCodeFromPrompt(
  prompt: string,
  code?: string,
): Promise<GeneratedResponse> {
  try {
    // @ts-ignore
    const wsApiUrl = window.ENV.WS_API_URL;
    if (!wsApiUrl) {
      throw new Error('WS_API_URL env variable is not set');
    }

    const OPENAI_API_URL = `${wsApiUrl}/api/treenity/open-ai`;

    const messages = [
      ...SYSTEM_MESSAGES,
      {
        role: 'user',
        content: code
          ? `Here is the current code:\n${code}\n\nPlease apply this changes: ${prompt}`
          : `Generate component: ${prompt}`,
      },
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        functions: [generateReactComponentSchema],
        function_call: { name: generateReactComponentSchema.name },
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const result = JSON.parse(data.choices[0].message.function_call.arguments) as GeneratedResponse;

    return result;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate code using OpenAI API');
  }
}
