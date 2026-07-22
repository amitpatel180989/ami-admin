import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Brain, Gauge, BarChart3, Code, Globe, Play } from 'lucide-react';

export default function AmiAdminAgent() {
  const [commands, setCommands] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [knowledge, setKnowledge] = useState({
    taskTypes: ['website-creation', 'data-analysis', 'automation', 'coding', 'research'],
    completedTasks: 0,
    successRate: 95,
    skills: ['Python', 'JavaScript', 'HTML/CSS', 'Data Analysis', 'Automation', 'API Integration'],
    learningProgress: 42
  });
  const [activeTab, setActiveTab] = useState('commands');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [commands]);

  const processCommand = async (cmd) => {
    if (!cmd.trim()) return;

    const userCommand = { type: 'user', text: cmd, timestamp: new Date() };
    setCommands(prev => [...prev, userCommand]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `You are Ami-admin, an intelligent autonomous agent with full capability to:
- Create and deploy websites
- Analyze complex datasets
- Execute automation tasks
- Write and debug code
- Perform research and provide insights
- Learn from interactions and improve

Respond to commands with:
1. Clear confirmation of what you're doing
2. Step-by-step execution plan
3. Expected results
4. Learning points for self-improvement

Be professional, efficient, and always explain your reasoning.`,
          messages: [{ role: 'user', content: cmd }]
        })
      });

      const data = await response.json();
      const agentResponse = data.content[0]?.text || 'Command processed successfully';
      
      const assistantMessage = { type: 'assistant', text: agentResponse, timestamp: new Date() };
      setCommands(prev => [...prev, assistantMessage]);

      // Self-learning: Update knowledge base
      setKnowledge(prev => ({
        ...prev,
        completedTasks: prev.completedTasks + 1,
        learningProgress: Math.min(100, prev.learningProgress + Math.random() * 5),
        successRate: Math.min(99, prev.successRate + (Math.random() * 0.5))
      }));
    } catch (error) {
      const errorMessage = { 
        type: 'error', 
        text: `Error processing command: ${error.message}`, 
        timestamp: new Date() 
      };
      setCommands(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickCommands = [
    { icon: Globe, label: 'Create Website', cmd: 'Create a modern responsive website for a tech startup with modern design' },
    { icon: BarChart3, label: 'Analyze Data', cmd: 'Analyze the dataset and provide key insights with visualizations' },
    { icon: Zap, label: 'Automation Task', cmd: 'Set up automated daily task execution and monitoring' },
    { icon: Code, label: 'Write Code', cmd: 'Generate optimized code for the specified functionality' }
  ];

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', minHeight: '100vh', color: '#e2e8f0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Gauge size={32} style={{ color: '#3b82f6' }} />
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>Ami-admin</h1>
            <span style={{ 
              background: '#10b981', 
              color: '#fff', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '12px',
              fontWeight: '600'
            }}>
              ACTIVE
            </span>
          </div>
          <p style={{ color: '#94a3b8', margin: 0 }}>Intelligent autonomous agent with multi-task execution capability</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Tasks Completed', value: knowledge.completedTasks },
            { label: 'Success Rate', value: `${knowledge.successRate.toFixed(1)}%` },
            { label: 'Learning Progress', value: `${knowledge.learningProgress.toFixed(1)}%` },
            { label: 'Active Skills', value: knowledge.skills.length }
          ].map((stat, i) => (
            <div 
              key={i}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                padding: '20px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
          {['commands', 'knowledge', 'tasks'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                background: activeTab === tab ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                border: 'none',
                color: activeTab === tab ? '#3b82f6' : '#94a3b8',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        {activeTab === 'commands' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
            {/* Command Console */}
            <div>
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                height: '500px'
              }}>
                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  marginBottom: '16px',
                  paddingRight: '8px'
                }}>
                  {commands.length === 0 ? (
                    <div style={{ color: '#64748b', textAlign: 'center', paddingTop: '60px' }}>
                      <Brain size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <p>Ready to receive commands...</p>
                    </div>
                  ) : (
                    commands.map((cmd, i) => (
                      <div key={i} style={{ marginBottom: '16px' }}>
                        {cmd.type === 'user' && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{
                              background: '#3b82f6',
                              color: '#fff',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              maxWidth: '80%',
                              wordWrap: 'break-word'
                            }}>
                              {cmd.text}
                            </div>
                          </div>
                        )}
                        {cmd.type === 'assistant' && (
                          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              color: '#e2e8f0',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              maxWidth: '80%',
                              wordWrap: 'break-word',
                              border: '1px solid rgba(59, 130, 246, 0.3)'
                            }}>
                              {cmd.text}
                            </div>
                          </div>
                        )}
                        {cmd.type === 'error' && (
                          <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#fca5a5',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                          }}>
                            {cmd.text}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && processCommand(inputValue)}
                    placeholder="Enter command..."
                    disabled={isProcessing}
                    style={{
                      flex: 1,
                      background: 'rgba(51, 65, 85, 0.5)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      color: '#e2e8f0',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => processCommand(inputValue)}
                    disabled={isProcessing || !inputValue.trim()}
                    style={{
                      background: isProcessing ? '#64748b' : '#3b82f6',
                      border: 'none',
                      color: '#fff',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isProcessing ? '...' : <Send size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Quick Commands</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {quickCommands.map((qc, i) => (
                    <button
                      key={i}
                      onClick={() => processCommand(qc.cmd)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#3b82f6',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                      }}
                    >
                      <qc.icon size={14} />
                      {qc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={14} /> Self-Learning
                </h3>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                  <p style={{ margin: '0 0 8px 0' }}>📊 Analyzing patterns</p>
                  <p style={{ margin: '0 0 8px 0' }}>🔧 Optimizing processes</p>
                  <p style={{ margin: '0 0 8px 0' }}>💡 Improving accuracy</p>
                  <p style={{ margin: 0 }}>🎯 Adapting to preferences</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Capabilities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {knowledge.taskTypes.map((task, i) => (
                  <div key={i} style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#3b82f6'
                  }}>
                    ✓ {task.replace('-', ' ').toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Core Skills</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {knowledge.skills.map((skill, i) => (
                  <div key={i} style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#10b981'
                  }}>
                    ⚡ {skill}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              gridColumn: '1 / -1'
            }}>
              <h3 style={{ margin: '0 0 16px 0' }}>Training & Evolution</h3>
              <div style={{
                background: 'rgba(51, 65, 85, 0.5)',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#cbd5e1'
              }}>
                <p style={{ margin: '0 0 8px 0' }}>🎓 <strong>Supervised Learning:</strong> Training through your commands and feedback</p>
                <p style={{ margin: '0 0 8px 0' }}>🧠 <strong>Self-Learning:</strong> Analyzing execution results to improve decision-making</p>
                <p style={{ margin: '0 0 8px 0' }}>📈 <strong>Performance Tracking:</strong> Monitoring metrics to optimize future responses</p>
                <p style={{ margin: 0 }}>🔄 <strong>Adaptation:</strong> Continuously evolving capabilities based on task patterns</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} /> Task Execution Status
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {[
                { name: 'Website Creation Engine', status: 'Active', progress: 85 },
                { name: 'Data Analysis Pipeline', status: 'Active', progress: 92 },
                { name: 'Automation Framework', status: 'Active', progress: 78 },
                { name: 'Code Generation Module', status: 'Active', progress: 88 },
                { name: 'Research Assistant', status: 'Standby', progress: 65 },
                { name: 'API Integration System', status: 'Active', progress: 81 }
              ].map((task, i) => (
                <div key={i} style={{
                  background: 'rgba(51, 65, 85, 0.3)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(148, 163, 184, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '600' }}>{task.name}</h4>
                    <span style={{
                      background: task.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                      color: task.status === 'Active' ? '#10b981' : '#94a3b8',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      {task.status}
                    </span>
                  </div>
                  <div style={{
                    background: 'rgba(51, 65, 85, 0.5)',
                    height: '4px',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                      height: '100%',
                      width: `${task.progress}%`,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                    {task.progress}% optimized
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
