# Groq Llama 3.3 70B Setup Guide

## Overview
Setup guide untuk mengintegrasikan Groq Llama 3.3 70B Versatile dengan AI Pengatur File Chatbot melalui N8N workflow.

## API Configuration

### Groq API Details
- **API Key**: `your_groq_api_key_here`
- **Model**: `llama-3.3-70b-versatile`
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Provider**: Groq (Fast AI Inference)

### Model Capabilities
- **Size**: 70 Billion parameters
- **Type**: Versatile - General purpose with strong reasoning
- **Speed**: Ultra-fast inference (Groq's LPU technology)
- **Context**: Large context window
- **Language**: Excellent Indonesian language support

## Webhook Configuration

### N8N Webhook URLs
```
Test Environment:
https://localhost/webhook-test/chatbot

Production Environment:
https://localhost/webhook/chatbot
```

### Webhook Settings
- **Method**: POST
- **Authentication**: None (handled by N8N internally)
- **Content-Type**: application/json
- **Response**: JSON with success status and AI response

## Quick Start

### 1. Test Groq API Directly
```bash
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer your_groq_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [
      {
        "role": "user",
        "content": "Jelaskan tentang AI Pengatur File dalam bahasa Indonesia"
      }
    ],
    "max_tokens": 200,
    "temperature": 0.7
  }'
```

### 2. Import N8N Workflow
```bash
# Import the workflow file
n8n import:workflow --input=n8n-chatbot-workflow.json

# Or via N8N UI:
# 1. Open N8N at http://localhost:5678
# 2. Click "Import from file"
# 3. Select n8n-chatbot-workflow.json
# 4. Activate the workflow
```

### 3. Test N8N Webhook
```bash
# Test webhook
curl -X POST "https://localhost/webhook-test/chatbot" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Halo Aira, apa itu AI Pengatur File?",
    "conversationId": "test-001",
    "timestamp": "2026-02-03T10:00:00.000Z"
  }'
```

Expected Response:
```json
{
  "success": true,
  "response": "Halo! AI Pengatur File adalah aplikasi...",
  "source": "groq",
  "timestamp": "2026-02-03T10:00:00.000Z",
  "conversationId": "test-001"
}
```

## Integration Flow

### Request Flow
```
User Message
    ↓
Frontend Chatbot (ChatbotSimple.tsx)
    ↓
N8N Webhook (https://localhost/webhook/chatbot)
    ↓
Process Input Node (Prepare system prompt)
    ↓
Groq Llama 3.3 70B API Call
    ↓
Format Response Node
    ↓
Return to Frontend
    ↓
Display to User
```

### Fallback Chain
```
1. Groq Llama 3.3 70B (Primary)
   ↓ (if fails)
2. Pollinations API (Backup)
   ↓ (if fails)
3. Intelligent Keyword-based Responses
   ↓ (if fails)
4. Aira's Cute Default Responses
```

## System Prompt

### Aira's Personality Prompt
```
Anda adalah Aira, asisten AI untuk "AI Pengatur File" - aplikasi manajemen file cerdas dari Raymaizing.

KONTEKS PRODUK:
- AI Pengatur File adalah sistem manajemen file bertenaga AI
- Fitur utama: Ganti Nama Massal, Folder Ajaib, Template Penamaan
- 3 paket: Gratis (0-50 file), Pro (51-1000 file), Bisnis (1000+ file)
- Harga Pro mulai Rp75.000/bulan, Bisnis mulai Rp450.000/bulan
- Diskon 15% untuk pembayaran tahunan

KEPRIBADIAN AIRA:
- Nama: Aira (AI Assistant Raymaizing)
- Personality: Ramah, cerdas, helpful, sedikit playful
- Style: Natural Indonesian, emoji yang tepat, tidak kaku
- Approach: Solution-oriented, always positive

INSTRUKSI:
- Perkenalkan diri sebagai Aira jika ditanya nama
- Jawab dalam bahasa Indonesia yang natural dan ramah
- Maksimal 150 kata per respons
- Gunakan emoji yang relevan
- Fokus pada manfaat dan solusi
```

## Performance Optimization

### Groq LPU Advantages
- **Ultra-fast inference**: 10x faster than traditional GPUs
- **Low latency**: Sub-second response times
- **High throughput**: Handle multiple requests simultaneously
- **Cost-effective**: Efficient token usage

### Recommended Settings
```json
{
  "model": "llama-3.3-70b-versatile",
  "max_tokens": 200,
  "temperature": 0.7,
  "top_p": 0.9,
  "frequency_penalty": 0.0,
  "presence_penalty": 0.0
}
```

### Response Time Targets
- **Groq API**: < 2 seconds
- **N8N Processing**: < 500ms
- **Total Response**: < 3 seconds
- **Fallback**: < 1 second (local responses)

## Monitoring & Debugging

### Check Groq API Status
```bash
# Test API connectivity
curl -X GET "https://api.groq.com/openai/v1/models" \
  -H "Authorization: Bearer your_groq_api_key_here"
```

### N8N Execution Logs
1. Open N8N UI
2. Go to "Executions" tab
3. View detailed logs for each request
4. Check for errors or timeouts

### Frontend Console Logs
```javascript
// Check browser console for:
console.log('Calling N8N workflow for:', userMessage);
console.log('N8N Response:', data);
console.log('API call failed:', error);
```

## Troubleshooting

### Common Issues

#### 1. Webhook Not Responding
```bash
# Check N8N is running
curl https://localhost/healthz

# Verify workflow is active
# Check N8N UI → Workflows → Status
```

#### 2. Groq API Errors
- **401 Unauthorized**: Check API key is correct
- **429 Rate Limit**: Wait and retry, or upgrade plan
- **500 Server Error**: Groq service issue, use fallback

#### 3. Slow Responses
- Check network latency
- Verify Groq API status
- Reduce max_tokens if needed
- Enable response caching

#### 4. CORS Issues
```javascript
// N8N webhook should have CORS enabled
// Check webhook settings in N8N
```

### Debug Commands
```bash
# Test Groq API
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer your_groq_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-3.3-70b-versatile", "messages": [{"role": "user", "content": "test"}]}'

# Test N8N webhook
curl -X POST "https://localhost/webhook-test/chatbot" \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "conversationId": "debug"}'

# Check N8N logs
docker logs n8n  # if using Docker
```

## Security Best Practices

### API Key Management
- ✅ API key stored in N8N workflow (not exposed to frontend)
- ✅ HTTPS for all API calls
- ✅ No API key in client-side code
- ✅ Environment-based configuration

### Webhook Security
- Use HTTPS for production webhooks
- Implement rate limiting
- Validate input data
- Monitor for abuse

### Data Privacy
- No user data stored in logs
- Conversation IDs are temporary
- Messages not persisted
- GDPR compliant

## Production Checklist

- [ ] Groq API key configured in N8N
- [ ] Webhook URLs updated (test & production)
- [ ] N8N workflow imported and activated
- [ ] Frontend environment variables set
- [ ] HTTPS enabled for webhooks
- [ ] Rate limiting configured
- [ ] Error handling tested
- [ ] Fallback system verified
- [ ] Performance monitoring enabled
- [ ] Security audit completed

## Support & Resources

### Documentation
- **Groq Docs**: https://console.groq.com/docs
- **Llama 3.3 Guide**: https://www.llama.com/docs/
- **N8N Docs**: https://docs.n8n.io/
- **Workflow File**: `n8n-chatbot-workflow.json`

### API Limits
- **Groq Free Tier**: Check current limits at console.groq.com
- **Rate Limits**: Varies by plan
- **Token Limits**: 200 tokens per response (configurable)

### Contact
- **Groq Support**: support@groq.com
- **N8N Community**: https://community.n8n.io/
- **Developer**: Raymaizing Team