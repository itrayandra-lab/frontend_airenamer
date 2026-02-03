# N8N Workflow Setup untuk AI Pengatur File Chatbot

## Overview
Workflow N8N ini menghubungkan chatbot website dengan AI models (Groq Llama 3.2 3B atau Pollinations) untuk memberikan respons yang intelligent dan contextual.

## Prerequisites

### 1. N8N Installation
```bash
# Install N8N globally
npm install n8n -g

# Or run with Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

### 2. API Keys Required
- **Groq API Key**: `your_groq_api_key_here`
- **Model**: Llama 3.3 70B Versatile (`llama-3.3-70b-versatile`)
- **Pollinations API Key** (Backup): `sk_Eilu4fFFCl269IDZLgtu1KHpjN3HJgNOTypeNameKeyCreated`

### 3. Webhook URLs
- **Test**: `https://localhost/webhook-test/chatbot`
- **Production**: `https://localhost/webhook/chatbot`

## Setup Instructions

### Step 1: Import Workflow
1. Buka N8N di `http://localhost:5678`
2. Klik "Import from file"
3. Upload file `n8n-chatbot-workflow.json`
4. Workflow akan ter-import dengan semua nodes

### Step 2: Configure Credentials

#### Groq API Credential (Already Configured)
The workflow now includes the Groq API key directly:
- **API Key**: `your_groq_api_key_here`
- **Model**: `llama-3.3-70b-versatile` (Llama 3.3 70B)
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`

#### Test Groq API
```bash
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer your_groq_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 100
  }'
```

### Step 3: Activate Workflow
1. Click "Activate" toggle di workflow
2. Webhook akan aktif di:
   - **Test**: `https://localhost/webhook-test/chatbot`
   - **Production**: `https://localhost/webhook/chatbot`
3. Test webhook dengan curl atau Postman

### Step 4: Test Workflow
```bash
# Test webhook
curl -X POST "https://localhost/webhook-test/chatbot" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Apa itu AI Pengatur File?",
    "conversationId": "test-123",
    "timestamp": "2026-02-03T08:40:00.000Z"
  }'
```

Expected Response:
```json
{
  "success": true,
  "response": "AI Pengatur File adalah aplikasi...",
  "source": "groq",
  "timestamp": "2026-02-03T08:40:00.000Z",
  "conversationId": "test-123"
}
```

## Workflow Architecture

### Node Flow
```
Webhook Trigger → Process Input → [Groq Llama 3.2 3B | Pollinations Backup] → Format Response → Webhook Response
```

### 1. Webhook Trigger
- **Path**: `/chatbot`
- **Method**: POST
- **CORS**: Enabled for all origins
- **Input**: `{message, conversationId, timestamp}`

### 2. Process Input
- Validates and extracts user message
- Prepares system prompt for AI
- Generates conversation context

### 3. AI Processing (Parallel)
- **Primary**: Groq Llama 3.3 70B Versatile (faster, more capable)
- **Backup**: Pollinations API (fallback option)
- **Timeout**: 30s for Groq, 15s for Pollinations
- **Model**: `llama-3.3-70b-versatile` - Advanced reasoning and fast inference

### 4. Format Response
- Processes AI response from either source
- Implements intelligent fallback if both APIs fail
- Returns structured response

### 5. Webhook Response
- Returns JSON response to chatbot
- Includes success status, response text, and metadata

## Intelligent Fallback System

Jika kedua AI API gagal, workflow menggunakan fallback responses:

### Keyword-Based Responses
- **Harga/Paket**: Informasi pricing dan paket
- **Fitur/Fungsi**: Penjelasan fitur utama
- **Cara/Tutorial**: Panduan penggunaan
- **Default**: Greeting dan menu bantuan

### Response Categories
```javascript
// Pricing queries
if (userMessage.includes('harga') || userMessage.includes('biaya')) {
  return pricingResponse;
}

// Feature queries  
if (userMessage.includes('fitur') || userMessage.includes('fungsi')) {
  return featureResponse;
}

// How-to queries
if (userMessage.includes('cara') || userMessage.includes('bagaimana')) {
  return tutorialResponse;
}
```

## Monitoring & Debugging

### Execution Logs
- N8N provides detailed execution logs
- Monitor response times and error rates
- Track which AI service is being used

### Error Handling
- **Groq Timeout**: Automatic fallback to Pollinations
- **Both APIs Fail**: Intelligent keyword-based responses
- **Invalid Input**: Graceful error messages

### Performance Metrics
- **Response Time**: Target <3 seconds
- **Success Rate**: Monitor API availability
- **Fallback Usage**: Track when fallbacks are triggered

## Chatbot Integration

### Frontend Configuration
Chatbot akan otomatis call N8N webhook:
```javascript
// Use environment-based webhook URL
const webhookUrl = process.env.NODE_ENV === 'production' 
  ? 'https://localhost/webhook/chatbot'
  : 'https://localhost/webhook-test/chatbot';

const n8nResponse = await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    conversationId: Date.now().toString(),
    timestamp: new Date().toISOString()
  })
});
```

### Response Handling
```javascript
if (n8nResponse.ok) {
  const data = await n8nResponse.json();
  if (data.success && data.response) {
    return data.response; // Display AI response
  }
}
// Fallback to local intelligent responses
```

## Production Deployment

### Environment Variables
```env
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://localhost
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

### Security Considerations
- Use HTTPS for production webhooks
- Implement rate limiting
- Validate input data
- Monitor for abuse

### Scaling Options
- **Horizontal**: Multiple N8N instances with load balancer
- **Vertical**: Increase server resources
- **Caching**: Cache common responses
- **CDN**: Distribute webhook endpoints

## Troubleshooting

### Common Issues

#### 1. Webhook Not Responding
```bash
# Check N8N status
curl http://localhost:5678/healthz

# Verify workflow is active
# Check N8N logs for errors
```

#### 2. Groq API Errors
- Verify API key is correct
- Check rate limits
- Monitor Groq service status

#### 3. Slow Responses
- Reduce max_tokens in AI calls
- Implement response caching
- Optimize system prompts

#### 4. Fallback Always Triggered
- Test individual API endpoints
- Check network connectivity
- Verify credentials configuration

### Debug Commands
```bash
# Test Groq API directly
curl -X POST "https://api.groq.com/openai/v1/models" \
  -H "Authorization: Bearer YOUR_KEY"

# Test N8N webhook
curl -X POST "http://localhost:5678/webhook/ai-pengatur-file-chatbot" \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "conversationId": "debug"}'

# Check N8N logs
docker logs n8n  # if using Docker
```

## Maintenance

### Regular Tasks
- Monitor API usage and costs
- Update system prompts based on user feedback
- Review and optimize fallback responses
- Check for N8N updates

### Performance Optimization
- Analyze response patterns
- Optimize AI model parameters
- Implement response caching
- Monitor and tune timeouts

### Backup & Recovery
- Export workflow configuration regularly
- Backup credential configurations
- Document custom modifications
- Test disaster recovery procedures

## Support

### Resources
- **N8N Documentation**: https://docs.n8n.io/
- **Groq API Docs**: https://console.groq.com/docs
- **Pollinations Docs**: https://pollinations.ai/
- **Workflow File**: `n8n-chatbot-workflow.json`

### Contact
- **Developer**: Raymaizing Team
- **Issues**: GitHub repository
- **N8N Community**: https://community.n8n.io/