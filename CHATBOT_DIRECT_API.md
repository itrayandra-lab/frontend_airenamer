# Chatbot Direct API Connection - Groq Llama 3.3 70B

## Overview
Chatbot sekarang langsung connect ke Groq API tanpa perlu N8N sebagai middleware. Ini membuat setup lebih simple dan response lebih cepat!

## Configuration

### Direct Groq API Call
```javascript
// Chatbot langsung call Groq API
const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_groq_api_key_here'
  },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 200,
    temperature: 0.7
  })
});
```

### API Details
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Model**: `llama-3.3-70b-versatile`
- **API Key**: `your_groq_api_key_here`
- **Max Tokens**: 200
- **Temperature**: 0.7

## How It Works

### Request Flow
```
User Message
    ↓
Aira Chatbot (Frontend)
    ↓
Groq API (Direct Call)
    ↓
Llama 3.3 70B Processing
    ↓
AI Response
    ↓
Display to User
```

### Fallback Chain
```
1. Groq Llama 3.3 70B (Primary - Direct API)
   ↓ (if fails)
2. Pollinations API (Backup)
   ↓ (if fails)
3. Intelligent Keyword Responses
   ↓ (if fails)
4. Aira's Cute Default Responses
```

## Testing

### 1. Open Browser
```
http://localhost:8081/
```

### 2. Click Aira Chatbot Button
- Floating button di kanan bawah
- Avatar Aira yang cute
- Blue glow effect

### 3. Send Test Messages
```
Test 1: "Halo Aira!"
Expected: Greeting response

Test 2: "Apa itu AI Pengatur File?"
Expected: Detailed explanation dari Groq

Test 3: "Berapa harganya?"
Expected: Pricing information

Test 4: "Bagaimana cara pakainya?"
Expected: Tutorial steps
```

### 4. Check Console Logs
Open browser DevTools (F12) dan check console:
```javascript
// You should see:
"Calling Groq Llama 3.3 70B for: [your message]"
"Groq API Response: {...}"
```

## Advantages of Direct API

### ✅ Pros
- **Faster**: No middleware overhead
- **Simpler**: No N8N setup required
- **Reliable**: Direct connection to Groq
- **Easier Debug**: Clear error messages
- **Lower Latency**: One less hop

### ⚠️ Cons
- **API Key Exposed**: Visible in browser network tab
- **Rate Limits**: Direct to your account
- **No Caching**: Every request hits API

## Security Considerations

### Current Setup (Development)
- API key in frontend code
- Suitable for development/testing
- Easy to debug and test

### Production Recommendations
1. **Use Backend Proxy**: Hide API key
2. **Implement Rate Limiting**: Prevent abuse
3. **Add Authentication**: Verify users
4. **Monitor Usage**: Track API calls

### Optional: N8N Middleware
If you want to add N8N later for:
- API key security
- Request caching
- Usage analytics
- Rate limiting
- Multiple AI providers

You can follow the `N8N_WORKFLOW_SETUP.md` guide.

## Troubleshooting

### Issue: No Response from Chatbot
**Check:**
1. Browser console for errors
2. Network tab for API calls
3. Groq API status
4. Internet connection

**Debug:**
```javascript
// Open browser console (F12)
// Look for these logs:
console.log('Calling Groq Llama 3.3 70B for:', userMessage);
console.log('Groq API Response:', data);
console.log('Groq API error:', error);
```

### Issue: API Error 401
**Cause**: Invalid API key
**Solution**: Check API key is correct

### Issue: API Error 429
**Cause**: Rate limit exceeded
**Solution**: Wait and retry, or upgrade Groq plan

### Issue: Slow Response
**Cause**: Network latency or API load
**Solution**: 
- Check internet connection
- Try again later
- Fallback will activate automatically

### Issue: CORS Error
**Cause**: Browser blocking cross-origin request
**Solution**: 
- Groq API supports CORS
- Check browser console for details
- May need backend proxy for production

## Performance Metrics

### Expected Response Times
- **Groq API Call**: 1-3 seconds
- **Total Response**: 2-4 seconds
- **Fallback**: < 1 second (instant)

### Token Usage
- **System Prompt**: ~150 tokens
- **User Message**: Variable
- **Response**: Max 200 tokens
- **Total per request**: ~350-400 tokens

## Monitoring

### Browser Console Logs
```javascript
// Success
"Calling Groq Llama 3.3 70B for: Halo Aira!"
"Groq API Response: {choices: [...], usage: {...}}"

// Error
"Groq API failed, status: 429"
"Groq API error: Rate limit exceeded"
"Using intelligent fallback"
```

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Look for `chat/completions` request
4. Check:
   - Status: 200 OK
   - Response time
   - Response data

## Quick Test Script

### Test Groq API Directly
```bash
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer your_groq_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [
      {
        "role": "system",
        "content": "Anda adalah Aira, asisten AI untuk AI Pengatur File. Jawab dalam bahasa Indonesia yang ramah."
      },
      {
        "role": "user",
        "content": "Halo Aira, apa itu AI Pengatur File?"
      }
    ],
    "max_tokens": 200,
    "temperature": 0.7
  }'
```

Expected Response:
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1738584000,
  "model": "llama-3.3-70b-versatile",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Halo! Saya Aira, senang bertemu dengan Anda! 👋\n\nAI Pengatur File adalah..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 180,
    "total_tokens": 330
  }
}
```

## Current Status

✅ **Working Features:**
- Direct Groq API connection
- Llama 3.3 70B model
- Indonesian language support
- Aira personality
- Fallback system
- Error handling
- Console logging

✅ **Ready to Use:**
- Open http://localhost:8081/
- Click Aira chatbot
- Start chatting!
- Get intelligent AI responses!

🎉 **No N8N Setup Required!**
Chatbot works out of the box dengan direct API connection!

## Support

### If You Need Help
1. Check browser console for errors
2. Test Groq API with curl command above
3. Verify API key is valid
4. Check Groq API status at console.groq.com

### Resources
- **Groq Console**: https://console.groq.com/
- **API Docs**: https://console.groq.com/docs
- **Model Info**: Llama 3.3 70B Versatile
- **Support**: support@groq.com