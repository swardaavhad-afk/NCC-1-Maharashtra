const fs = require('fs');

const path = "C:\\D\\NCC Folder\\NCC-1-Maharashtra\\frontend\\js\\cadet\\studyMaterials.js";
let content = fs.readFileSync(path, 'utf8');

const aiHtml = 
      <div class="fade-in">
        <!-- AI Assistant Section -->
        <div class="card mb-6 mb-8" style="background: linear-gradient(to right, #1a233a, #151b2e); border-left: 4px solid var(--primary-color);">
          <div class="card-header pb-2" style="border-bottom: 2px solid rgba(255, 193, 7, 0.1);">
            <h3 class="card-title" style="color:var(--text-yellow-400); display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.5rem;">??</span>
              NCC AI Study Assistant
            </h3>
            <p class="text-sm mt-1" style="color:var(--text-blue-200);">Ask any question about NCC syllabus, materials, or general knowledge.</p>
          </div>
          <div class="card-body mt-4">
            <div id="ai-chat-history" class="mb-4 p-4 rounded" style="background: rgba(0,0,0,0.3); max-height: 250px; overflow-y: auto; display: none; gap: 1rem; flex-direction: column;">
            </div>
            
            <form onsubmit="handleAIChat(event)" style="display:flex;gap:0.5rem;">
              <input type="text" id="ai-chat-input" class="form-control flex-1" placeholder="e.g. What is the weight of a 0.22 Rifle?" required>
              <button type="submit" id="ai-chat-btn" class="btn btn-primary" style="display:flex;align-items:center;gap:0.5rem">
                <span>Ask AI</span>
              </button>
            </form>
          </div>
        </div>
;

content = content.replace('<div class="fade-in">', aiHtml);

const aiLogic = 
async function handleAIChat(e) {
  e.preventDefault();
  const input = document.getElementById('ai-chat-input');
  const btn = document.getElementById('ai-chat-btn');
  const history = document.getElementById('ai-chat-history');
  
  const question = input.value.trim();
  if (!question) return;
  
  // Show history container if hidden
  history.style.display = 'flex';
  
  // Add user message
  history.innerHTML += \\\
    <div style="align-self: flex-end; background: var(--primary-hover); padding: 0.5rem 1rem; border-radius: 12px 12px 0 12px; max-width: 80%;">
      \
    </div>
  \\\;
  
  input.value = '';
  btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span> Thinking...';
  btn.disabled = true;
  history.scrollTop = history.scrollHeight;
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash-lite-preview",
        "messages": [
          {"role": "system", "content": "You are a helpful NCC (National Cadet Corps) AI Assistant. Answer concisely and accurately, focusing on Indian NCC curriculum, drills, weapon training, etc."},
          {"role": "user", "content": question}
        ]
      })
    });
    
    const data = await response.json();
    let answer = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "Sorry, I couldn't process that. Try again.";
    
    // Add AI response
    history.innerHTML += \\\
      <div style="align-self: flex-start; background: #2a344a; padding: 0.75rem 1rem; border-radius: 12px 12px 12px 0; border: 1px solid rgba(255,193,7,0.2); max-width: 80%;">
        \
      </div>
    \\\;
  } catch (err) {
    history.innerHTML += \\\
      <div style="align-self: flex-start; background: #4a2a2a; padding: 0.5rem 1rem; border-radius: 12px 12px 12px 0; color: #ff8a8a; max-width: 80%;">
        Error connecting to AI Assistant.
      </div>
    \\\;
  } finally {
    btn.innerHTML = '<span>Ask AI</span>';
    btn.disabled = false;
    history.scrollTop = history.scrollHeight;
  }
}
;

content += '\n' + aiLogic;

fs.writeFileSync(path, content);
console.log('updated studyMaterials.js');
