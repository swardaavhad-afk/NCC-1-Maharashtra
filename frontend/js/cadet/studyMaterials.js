// =============================================
// Cadet Study Material Access
// =============================================
async function loadCadetStudyMaterials(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading study materials...</div>';

  try {
    const data = await api.get('/study-materials');
    const { materials } = data;

    const categoryIcons = {
      'Drill': '🎯', 'Weapon Training': '🔫', 'Map Reading': '🗺️',
      'Field Craft': '🏕️', 'Administration': '📋', 'National Integration': '🇮🇳',
      'Social Service': '🤝', 'Health & Hygiene': '🏥', 'Disaster Management': '🚨'
    };

    container.innerHTML = `
      <div class="fade-in">
        <!-- AI Assistant Section -->
        <div class="card mb-6 mb-8" style="background: linear-gradient(to right, #1a233a, #151b2e); border-left: 4px solid var(--primary-color);">
          <div class="card-header pb-2" style="border-bottom: 2px solid rgba(255, 193, 7, 0.1);">
            <h3 class="card-title" style="color:var(--text-yellow-400); display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.5rem;">🤖</span>
              NCC AI Study Assistant
            </h3>
            <p class="text-sm mt-1" style="color:var(--text-blue-200);">Ask any question about NCC syllabus, materials, or general knowledge.</p>
          </div>
          <div class="card-body mt-4">
            <div id="ai-chat-history" class="mb-4 p-4 rounded" style="background: rgba(0,0,0,0.3); max-height: 350px; overflow-y: auto; display: none; gap: 1rem; flex-direction: column;">
            </div>
            
            <form onsubmit="handleAIChat(event)" style="display:flex;gap:0.5rem;">
              <input type="text" id="ai-chat-input" class="form-control flex-1" placeholder="e.g. What is the weight of a 0.22 Rifle?" required>
              <button type="submit" id="ai-chat-btn" class="btn btn-primary" style="display:flex;align-items:center;gap:0.5rem">
                <span>Ask AI</span>
              </button>
            </form>
          </div>
        </div>

        <div class="tab-bar mb-6">
          <button class="tab-btn active" onclick="filterCadetMaterials('all', this)">All</button>
          <button class="tab-btn" onclick="filterCadetMaterials('Drill', this)">Drill</button>
          <button class="tab-btn" onclick="filterCadetMaterials('Weapon Training', this)">Weapon</button>
          <button class="tab-btn" onclick="filterCadetMaterials('Map Reading', this)">Map Reading</button>
          <button class="tab-btn" onclick="filterCadetMaterials('Field Craft', this)">Field Craft</button>
          <button class="tab-btn" onclick="filterCadetMaterials('Administration', this)">Admin</button>
        </div>

        <div class="grid grid-2" id="cadet-materials-grid">
          ${materials.map(m => `
            <div class="card material-card" data-category="${m.category}">
              <div style="display:flex;gap:1rem;align-items:flex-start">
                <div style="font-size:2rem">${categoryIcons[m.category] || '📄'}</div>
                <div style="flex:1">
                  <div class="font-bold">${m.title}</div>
                  <div class="text-sm" style="color:var(--text-blue-200)">${m.description || ''}</div>
                  <div style="display:flex;gap:0.5rem;margin-top:0.5rem;flex-wrap:wrap">
                    <span class="badge badge-blue">${m.category}</span>
                    <span class="badge badge-yellow">${m.year}</span>
                  </div>
                  <div class="text-xs mt-2" style="color:var(--text-blue-300)">${m.downloadCount} downloads • ${m.fileName || 'File'}</div>
                </div>
              </div>
              ${m.fileUrl ? `
                <a href="${m.fileUrl}" target="_blank" class="btn btn-primary btn-sm btn-block mt-4" onclick="trackDownload('${m.id}')">
                  📥 Download
                </a>
              ` : ''}
            </div>
          `).join('')}
        </div>

        ${!materials.length ? '<div class="empty-state"><div class="empty-state-icon">📚</div><h3>No study materials available</h3><p>Check back later for new materials.</p></div>' : ''}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error: ${err.message}</p></div>`;
  }
}

function filterCadetMaterials(category, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#cadet-materials-grid .material-card').forEach(card => {
    card.style.display = (category === 'all' || card.dataset.category === category) ? '' : 'none';
  });
}

async function trackDownload(materialId) {
  try {
    await api.post(`/study-materials/${materialId}/download`);
  } catch (e) {
    // Silent fail for download tracking
  }
}

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
  history.innerHTML += `
    <div style="align-self: flex-end; background: var(--primary-hover); padding: 0.75rem 1rem; border-radius: 12px 12px 0 12px; max-width: 80%;">
      ${question}
    </div>
  `;
  
  input.value = '';
  btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;border-color:#1a233a;border-top-color:transparent;display:inline-block;border-radius:50%;animation:spin 1s linear infinite;"></span> Thinking...';
  btn.disabled = true;
  history.scrollTop = history.scrollHeight;
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-Title": "NCC Maharashtra"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash",
        "max_tokens": 1000,
        "messages": [
          {"role": "system", "content": "You are a helpful NCC (National Cadet Corps) AI Assistant for the Maharashtra Directorate. Answer concisely and accurately, focusing on Indian NCC curriculum, drills, weapon training, map reading, camps, etc. Format text with simple HTML tags (like <b> or <br>) when helpful since it will be rendered directly via innerHTML."},
          {"role": "user", "content": question}
        ]
      })
    });
    
    const data = await response.json();
    let answer = (data.choices && data.choices.length > 0 && data.choices[0].message) 
      ? data.choices[0].message.content 
      : "Sorry, I couldn't process that. Please try again.";
    
    // Add AI response
    history.innerHTML += `
      <div style="align-self: flex-start; background: #2a344a; padding: 0.75rem 1rem; border-radius: 12px 12px 12px 0; border: 1px solid rgba(255,193,7,0.2); max-width: 80%;">
        ${answer.replace(/\n/g, '<br>')}
      </div>
    `;
  } catch (err) {
    console.error("AI Error:", err);
    history.innerHTML += `
      <div style="align-self: flex-start; background: #4a2a2a; padding: 0.75rem 1rem; border-radius: 12px 12px 12px 0; color: #ff8a8a; max-width: 80%;">
        Something went wrong communicating with the AI Assistant.
      </div>
    `;
  } finally {
    btn.innerHTML = '<span>Ask AI</span>';
    btn.disabled = false;
    history.scrollTop = history.scrollHeight;
  }
}

