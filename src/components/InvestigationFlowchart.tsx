import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, Edit, Trash2, Play, RotateCcw, Save, Download, Eye, X } from 'lucide-react';
import NodeForm from './NodeForm';
import { motion } from 'framer-motion';

interface Option {
  text: string;
  nextNodeId: string | null;
}

interface Node {
  id: string;
  question: string;
  options: Record<string, Option>;
  isEndpoint: boolean;
  endpointMessage: string | null;
  selectionMode: 'single' | 'multiple';
}

interface Flowchart {
  nodes: Node[];
  startNodeId: string;
}

interface PathStep {
  nodeId: string;
  question: string;
  selectedOptions: string[];
  selectedTexts: string[];
  selectionMode: 'single' | 'multiple';
  timestamp: string;
}

interface NodeFormData {
  question: string;
  options: Record<string, Option>;
  isEndpoint: boolean;
  endpointMessage: string | null;
  selectionMode: 'single' | 'multiple';
}

const defaultFlowchart: Flowchart = {
  nodes: [
    {
      id: 'node_1',
      question: 'Do you have Business Events to process?',
      options: {
        option1: { text: 'Yes', nextNodeId: 'node_2' },
        option2: { text: 'No', nextNodeId: 'node_3' }
      },
      isEndpoint: false,
      endpointMessage: null,
      selectionMode: 'single'
    },
    {
      id: 'node_2',
      question: 'What checks do you need to perform? (Select all that apply)',
      options: {
        option1: { text: 'Check BCT/RiskPortfolio Limits', nextNodeId: 'node_8' },
        option2: { text: 'Check ADS Rules', nextNodeId: 'node_9' },
        option3: { text: 'Verify Settlement Instructions', nextNodeId: 'node_10' },
        option4: { text: 'Review Counterparty Limits', nextNodeId: 'node_11' }
      },
      isEndpoint: false,
      endpointMessage: null,
      selectionMode: 'multiple'
    },
    {
      id: 'node_3',
      question: 'Do you have an EMSN (Electronic Message Sequence Number)?',
      options: {
        option1: { text: 'Yes', nextNodeId: 'node_6' },
        option2: { text: 'No', nextNodeId: 'node_7' }
      },
      isEndpoint: false,
      endpointMessage: null,
      selectionMode: 'single'
    },
    {
      id: 'node_4',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'Multiple investigation paths completed. Review all selected areas for comprehensive trade analysis.'
    },
    {
      id: 'node_5',
      question: 'Which system check do you need to perform?',
      options: {
        option1: { text: 'Check BCT/RiskPortfolio Limits', nextNodeId: 'node_8' },
        option2: { text: 'Check ADS Rules', nextNodeId: 'node_9' }
      },
      isEndpoint: false,
      endpointMessage: null,
      selectionMode: 'single'
    },
    {
      id: 'node_6',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'Find the EMSN and proceed with trade investigation. Use the EMSN to track the specific transaction through the system.'
    },
    {
      id: 'node_7',
      question: 'What type of trade details do you need?',
      options: {
        option1: { text: 'Ask for Trade Details', nextNodeId: 'node_10' },
        option2: { text: 'Escalate to TCAS', nextNodeId: 'node_11' }
      },
      isEndpoint: false,
      endpointMessage: null,
      selectionMode: 'single'
    },
    {
      id: 'node_8',
      question: 'What is the BCT/RiskPortfolio limit status?',
      options: {
        option1: { text: 'Limits are breached', nextNodeId: 'node_12' },
        option2: { text: 'Limits are within range', nextNodeId: 'node_13' }
      },
      isEndpoint: false,
      endpointMessage: null,
      selectionMode: 'single'
    },
    {
      id: 'node_9',
      question: 'What ADS rule issues do you observe? (Select all that apply)',
      options: {
        option1: { text: 'Pricing/Currency Blacklisted', nextNodeId: 'node_14' },
        option2: { text: 'MTF Enablement Issue', nextNodeId: 'node_15' },
        option3: { text: 'Settlement Date Conflict', nextNodeId: 'node_16' }
      },
      isEndpoint: false,
      endpointMessage: null,
      selectionMode: 'multiple'
    },
    {
      id: 'node_10',
      question: 'Do you have sufficient trade information?',
      options: {
        option1: { text: 'Yes, proceed with investigation', nextNodeId: 'node_16' },
        option2: { text: 'No, need more details', nextNodeId: 'node_17' }
      },
      isEndpoint: false,
      endpointMessage: null,
      selectionMode: 'single'
    },
    {
      id: 'node_11',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'Escalate to TCAS (Trade Capture and Settlement) team. Provide all available trade details and context for further investigation.'
    },
    {
      id: 'node_12',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'BCT/RiskPortfolio limits have been breached. Contact Risk Management team to review limit settings and authorize trade if appropriate.'
    },
    {
      id: 'node_13',
      question: 'Are there any other risk factors to consider?',
      options: {
        option1: { text: 'Yes, additional checks needed', nextNodeId: 'node_18' },
        option2: { text: 'No, proceed with trade', nextNodeId: 'node_19' }
      },
      isEndpoint: false,
      endpointMessage: null,
      selectionMode: 'single'
    },
    {
      id: 'node_14',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'Pricing/Currency is blacklisted in ADS rules. Review the blacklist settings and contact Compliance team to verify if the restriction should be lifted.'
    },
    {
      id: 'node_15',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'MTF (Multilateral Trading Facility) enablement issue detected. Check MTF configuration settings and contact Technology team for system updates.'
    },
    {
      id: 'node_16',
      question: 'What type of investigation is required?',
      options: {
        option1: { text: 'Standard trade validation', nextNodeId: 'node_20' },
        option2: { text: 'Complex scenario analysis', nextNodeId: 'node_21' }
      },
      isEndpoint: false,
      endpointMessage: null,
      selectionMode: 'single'
    },
    {
      id: 'node_17',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'Insufficient trade details provided. Request additional information including: Trade ID, Counterparty, Settlement Date, and Currency details before proceeding.'
    },
    {
      id: 'node_18',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'Additional risk checks required. Perform enhanced due diligence including credit risk assessment, market risk analysis, and regulatory compliance verification.'
    },
    {
      id: 'node_19',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'All risk checks passed successfully. Trade can proceed through normal settlement process. Monitor for any post-trade issues.'
    },
    {
      id: 'node_20',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'Perform standard trade validation: Verify trade details, check counterparty limits, validate pricing, and confirm settlement instructions are correct.'
    },
    {
      id: 'node_21',
      question: '',
      selectionMode: 'single',
      options: {
        option1: { text: '', nextNodeId: null },
        option2: { text: '', nextNodeId: null }
      },
      isEndpoint: true,
      endpointMessage: 'Complex scenario analysis required. Go to Trade Investigation Part 2: Scenario Analysis. Document all findings and escalate to senior trading desk if needed.'
    }
  ],
  startNodeId: 'node_1'
};

const InvestigationFlowchart: React.FC = () => {
  const [mode, setMode] = useState<'admin' | 'user'>('admin');
  const [flowchart, setFlowchart] = useState<Flowchart>(() => {
    const saved = localStorage.getItem('flowchart');
    return saved ? JSON.parse(saved) : defaultFlowchart;
  });
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [userPath, setUserPath] = useState<PathStep[]>([]);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [showPathView, setShowPathView] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showAddNode, setShowAddNode] = useState(false);
  const [endNote, setEndNote] = useState('');
  const [manualResult, setManualResult] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const [manuallyEnded, setManuallyEnded] = useState(false);

  // Load data from memory on component mount
  useEffect(() => {
    const savedFlowchart = localStorage.getItem('flowchart');
    if (savedFlowchart) {
      setFlowchart(JSON.parse(savedFlowchart));
    }
  }, []);

  // Save flowchart to memory
  const saveFlowchart = (newFlowchart: Flowchart) => {
    localStorage.setItem('flowchart', JSON.stringify(newFlowchart));
  };

  // Generate unique node ID
  const generateNodeId = () => {
    let counter = 1;
    while (flowchart.nodes.find(node => node.id === `node_${counter}`)) {
      counter++;
    }
    return `node_${counter}`;
  };

  // Add new node
  const addNode = (nodeData: NodeFormData) => {
    const newId = `node_${flowchart.nodes.length + 1}`;
    const newNode: Node = {
      id: newId,
      ...nodeData
    };

    const newFlowchart: Flowchart = {
      ...flowchart,
      nodes: [...flowchart.nodes, newNode]
    };

    setFlowchart(newFlowchart);
    saveFlowchart(newFlowchart);
    setShowAddNode(false);
  };

  // Update node
  const updateNode = (nodeId: string, nodeData: NodeFormData) => {
    const updatedNode: Node = {
      ...flowchart.nodes.find(node => node.id === nodeId)!,
      ...nodeData
    };

    const newFlowchart: Flowchart = {
      ...flowchart,
      nodes: flowchart.nodes.map(node => 
        node.id === nodeId ? updatedNode : node
      )
    };

    setFlowchart(newFlowchart);
    saveFlowchart(newFlowchart);
    setEditingNode(null);
  };

  // Delete node
  const deleteNode = (nodeId: string) => {
    if (nodeId === flowchart.startNodeId) {
      alert("Cannot delete the start node!");
      return;
    }

    const newNodes = flowchart.nodes.filter(node => node.id !== nodeId);
    const newFlowchart: Flowchart = {
      ...flowchart,
      nodes: newNodes
    };

    setFlowchart(newFlowchart);
    saveFlowchart(newFlowchart);
  };

  // Start user flow
  const startUserFlow = () => {
    setCurrentNodeId(flowchart.startNodeId);
    setUserPath([]);
    setMode('user');
  };

  // Handle user choice - updated for multiple selection support
  const handleChoice = (optionKey: string) => {
    if (!currentNodeId) return;
    
    const currentNode = flowchart.nodes.find(node => node.id === currentNodeId);
    if (!currentNode) return;

    if (currentNode.selectionMode === 'multiple') {
      setSelectedOptions(prev => {
        if (prev.includes(optionKey)) {
          return prev.filter(key => key !== optionKey);
        } else {
          return [...prev, optionKey];
        }
      });
    } else {
      proceedWithSelection([optionKey]);
    }
  };

  const confirmMultipleSelection = () => {
    if (selectedOptions.length > 0) {
      proceedWithSelection(selectedOptions);
    }
  };

  // Process the selection(s) and move to next step
  const proceedWithSelection = (selections: string[]) => {
    if (!currentNodeId || selections.length === 0) return;
    const currentNode = flowchart.nodes.find(node => node.id === currentNodeId);
    if (!currentNode) return;
    const selectedTexts = selections.map(key => currentNode.options[key]?.text ?? '');
    setUserPath(prev => [...prev, {
      nodeId: currentNodeId,
      question: currentNode.question,
      selectedOptions: selections,
      selectedTexts,
      selectionMode: currentNode.selectionMode,
      timestamp: new Date().toISOString()
    }]);
    const firstKey = selections[0];
    const nextNodeId = firstKey ? currentNode.options[firstKey]?.nextNodeId : null;
    if (nextNodeId) {
      setCurrentNodeId(nextNodeId);
      setSelectedOptions([]);
    }
  };

  // Reset flow
  const resetFlow = () => {
    setCurrentNodeId(null);
    setUserPath([]);
    setMode('admin');
  };

  // Export investigation path
  const exportPath = () => {
    if (userPath.length === 0) return;

    // Format the path data as text
    const pathText = userPath.map((step, index) => {
      const stepNumber = index + 1;
      const question = step.question;
      const selections = step.selectedTexts ? step.selectedTexts.join(', ') : '';
      return `Step ${stepNumber}:\nQuestion: ${question}\nSelected: ${selections}\n`;
    }).join('\n');

    // Calculate time spent
    let timeSpent = 0;
    if (userPath.length > 1) {
      const start = new Date(userPath[0].timestamp).getTime();
      const end = new Date(userPath[userPath.length - 1].timestamp).getTime();
      timeSpent = Math.round((end - start) / 1000); // in seconds
    }

    // Get the final result message
    const lastStep = userPath[userPath.length - 1];
    const resultNode = flowchart.nodes.find(node => node.id === lastStep.nodeId);
    const resultMessage = resultNode?.endpointMessage || 'Trade investigation process complete!';

    // Add timestamp, summary, and result
    const timestamp = new Date().toLocaleString();
    const exportContent = 
      `Trade Investigation Path\nGenerated on: ${timestamp}\n\n${pathText}\n\n` +
      `---\nResult: ${manualResult || resultMessage}\nNote: ${endNote}\nTime spent on this trade: ${timeSpent} seconds\n`;

    // Create and download the text file
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investigation-path-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Show path visualization
  const showPathVisualization = () => {
    if (userPath.length === 0) {
      alert('No path to show! Please complete the investigation first.');
      return;
    }
    setShowPathView(true);
  };

  // Path Visualization Component
  const PathVisualization: React.FC = () => {
    const resultNode = flowchart.nodes.find(node => node.id === currentNodeId);
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-2">
          <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-4 py-3 flex justify-between items-center flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Trade Investigation Process Flow</h2>
              <button
                onClick={() => setShowPathView(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Main Content - True Horizontal Layout */}
            <div className="flex-1 p-4 bg-gray-50 overflow-auto">
              {/* Title */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full text-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-blue-700 font-medium">Your Investigation Path - {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Horizontal Flowchart */}
              <div className="overflow-x-auto overflow-y-hidden">
                <div className="flex items-start gap-4 pb-4" style={{ minWidth: 'max-content' }}>
                  {/* START */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      START
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Begin</div>
                  </div>

                  {userPath.map((step, stepIndex) => {
                    const currentNode = flowchart.nodes.find(node => node.question === step.question);
                    
                    return (
                      <React.Fragment key={stepIndex}>
                        {/* Arrow */}
                        <div className="flex items-center mt-6">
                          <ChevronRight className="w-6 h-6 text-gray-400" />
                        </div>
                        
                        {/* Decision Point */}
                        <div className="flex flex-col items-center">
                          {/* Question Box */}
                          <div className="bg-blue-500 text-white p-3 rounded-lg text-center w-48 mb-3">
                            <div className="text-xs font-bold mb-1">STEP {stepIndex + 1}</div>
                            <div className="text-xs leading-tight">
                              {step.question.length > 50 ? step.question.substring(0, 50) + '...' : step.question}
                            </div>
                          </div>
                          
                          {/* All Options Displayed */}
                          <div className="flex flex-col gap-2 w-48">
                            {currentNode && Object.entries(currentNode.options).map(([optionKey, option]: [string, Option], index) => (
                              <div key={optionKey} className={`p-2 rounded border-2 text-xs ${
                                step.selectedOptions.includes(optionKey)
                                  ? 'bg-green-100 border-green-500 text-green-800 font-bold' 
                                  : 'bg-gray-100 border-gray-300 text-gray-600'
                              }`}>
                                <div className="flex items-center gap-1">
                                  {step.selectedOptions.includes(optionKey) && <span className="text-green-500">✓</span>}
                                  <span>{String.fromCharCode(65 + index)}) {option.text}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Selected path indicator */}
                          <div className="mt-2 text-xs font-bold text-green-600">
                            CHOSEN: {step.selectedTexts.join(', ')}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* Final Arrow */}
                  <div className="flex items-center mt-6">
                    <ChevronRight className="w-6 h-6 text-green-500" />
                  </div>

                  {/* RESULT */}
                  <div className="flex flex-col items-center">
                    <div className="bg-green-500 text-white p-3 rounded-lg text-center w-56">
                      <div className="text-xs font-bold mb-1">🎯 RESULT</div>
                      <div className="text-xs leading-tight">
                        {resultNode?.endpointMessage?.substring(0, 100) || ''}
                        {resultNode?.endpointMessage && resultNode.endpointMessage.length > 100 && '...'}
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center mt-6">
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* END */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      END
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Complete</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Summary */}
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 text-center">Investigation Path Summary</h3>
              
              {/* Path badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {userPath.map((step, index) => (
                  <div key={index} className="inline-flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {step.selectedTexts.join(', ')}
                    </span>
                    {index < userPath.length - 1 && (
                      <ChevronRight className="w-3 h-3 mx-1 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* Full questions and answers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {userPath.map((step, index) => {
                  const currentNode = flowchart.nodes.find(node => node.question === step.question);
                  return (
                    <div key={index} className="bg-gray-50 p-3 rounded border">
                      <div className="text-xs font-bold text-blue-600 mb-1">Step {index + 1}</div>
                      <div className="text-xs text-gray-700 mb-2 leading-relaxed">{step.question}</div>
                      <div className="text-xs space-y-1">
                        {currentNode && Object.entries(currentNode.options).map(([optionKey, option]: [string, Option], optIndex) => (
                          <div key={optionKey} className={step.selectedOptions.includes(optionKey) ? 'font-bold text-green-700' : 'text-gray-500'}>
                            {String.fromCharCode(65 + optIndex)}) {option.text} {step.selectedOptions.includes(optionKey) && '✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Final result */}
              <div className="bg-green-50 border border-green-200 p-3 rounded">
                <div className="text-sm font-bold text-green-800 mb-2">🎯 Investigation Outcome:</div>
                <div className="text-sm text-green-700 leading-relaxed">
                  {resultNode?.endpointMessage || 'Trade investigation process complete!'}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 flex justify-center gap-6 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-500">{userPath.length}</div>
                  <div className="text-xs text-gray-600">Investigation Steps</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-500">
                    {userPath.length > 0 ? Math.round((Date.now() - new Date(userPath[0].timestamp).getTime()) / 1000) : 0}s
                  </div>
                  <div className="text-xs text-gray-600">Time Taken</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-500">✓</div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-2 bg-white flex gap-2 justify-center flex-shrink-0">
            <button
              onClick={exportPath}
              className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600 transition-colors flex items-center"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </button>
            <button
              onClick={() => setShowPathView(false)}
              className="bg-gray-500 text-white px-4 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </>
    );
  };

  // Show path visualization modal
  if (showPathView) {
    return (
      <>
        <PathVisualization />
      </>
    );
  }

  // Admin Panel
  if (mode === 'admin') {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="flex-none sticky top-0 bg-gray-50 z-10 p-4 border-b">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Trade Investigation Admin Panel</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddNode(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Node
              </button>
              <button
                onClick={startUserFlow}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Test Investigation
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4 pb-8">
              {Object.values(flowchart.nodes).map((node, idx) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4, type: 'spring' }}
                  className="bg-white p-4 rounded-lg shadow-md border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          {node.id}
                        </span>
                        {node.id === flowchart.startNodeId && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                            START
                          </span>
                        )}
                        {node.isEndpoint && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                            ENDPOINT
                          </span>
                        )}
                      </div>
                      {node.isEndpoint ? (
                        <p className="text-gray-700 font-medium">{node.endpointMessage}</p>
                      ) : (
                        <>
                          <p className="text-gray-700 font-medium mb-2">{node.question}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              node.selectionMode === 'multiple' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {node.selectionMode === 'multiple' ? 'MULTIPLE SELECTION' : 'SINGLE SELECTION'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {Object.keys(node.options).length} options
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {Object.entries(node.options).map(([optionKey, option], index) => (
                              <div key={optionKey}>• {option.text} → {option.nextNodeId || 'None'}</div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingNode(node)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNode(node.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {showAddNode && (
          <NodeForm
            onSave={addNode}
            onCancel={() => setShowAddNode(false)}
          />
        )}

        {editingNode && (
          <NodeForm
            node={editingNode}
            onSave={(data) => updateNode(editingNode.id, data)}
            onCancel={() => setEditingNode(null)}
          />
        )}
      </div>
    );
  }

  // User Flow
  if (mode === 'user') {
    const currentNode = currentNodeId ? flowchart.nodes.find(node => node.id === currentNodeId) : null;

    if (!currentNode) {
      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Investigation Complete!</h1>
            <button
              onClick={resetFlow}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Admin
            </button>
          </div>
        </div>
      );
    }

    if (currentNode.isEndpoint) {
      if (manuallyEnded) {
        // Calculate time spent
        let timeSpent = 0;
        if (userPath.length > 1) {
          const start = new Date(userPath[0].timestamp).getTime();
          const end = new Date(userPath[userPath.length - 1].timestamp).getTime();
          timeSpent = Math.round((end - start) / 1000); // in seconds
        }

        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 overflow-auto">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Investigation Result</h2>
                <div className="text-gray-700 text-lg leading-relaxed mb-2">
                  <span className="font-bold">Result:</span> {manualResult || 'Ended'}
                </div>
                {endNote && (
                  <div className="text-gray-700 text-base leading-relaxed mb-2">
                    <span className="font-bold">Note:</span> {endNote}
                  </div>
                )}
              </div>

              {userPath.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg overflow-y-auto max-h-60">
                  <h3 className="font-medium text-gray-800 mb-2">Your Investigation Path:</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {userPath.map((step, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="truncate">{step.question}</span>
                        <span className="font-medium ml-2">{step.selectedTexts.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-gray-700 text-base leading-relaxed mb-4">
                <span className="font-bold">Time spent:</span> {timeSpent} seconds
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCurrentNodeId(flowchart.startNodeId);
                    setUserPath([]);
                    setManuallyEnded(false);
                    setEndNote('');
                    setManualResult('');
                  }}
                  className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start Over
                </button>
                <button
                  onClick={showPathVisualization}
                  className="flex-1 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Path
                </button>
                <button
                  onClick={exportPath}
                  className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Investigation
                </button>
              </div>
              
              <button
                onClick={() => {
                  setManuallyEnded(false);
                  setEndNote('');
                  setManualResult('');
                  resetFlow();
                }}
                className="w-full mt-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Admin
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Investigation Result</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{currentNode.endpointMessage}</p>
            </div>

            {userPath.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg overflow-y-auto max-h-60">
                <h3 className="font-medium text-gray-800 mb-2">Your Investigation Path:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {userPath.map((step, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="truncate">{step.question}</span>
                      <span className="font-medium ml-2">{step.selectedTexts.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentNodeId(flowchart.startNodeId);
                  setUserPath([]);
                }}
                className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </button>
              <button
                onClick={showPathVisualization}
                className="flex-1 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Path
              </button>
              <button
                onClick={exportPath}
                className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Investigation
              </button>
            </div>
            
            <button
              onClick={resetFlow}
              className="w-full mt-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Admin
            </button>
          </div>
        </div>
      );
    }

    // Get the options as an array for dynamic rendering
    const optionEntries = Object.entries(currentNode.options);

    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {userPath.length + 1}</span>
              <span>{currentNode.id}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((userPath.length + 1) / Object.keys(flowchart.nodes).length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentNode.question}</h2>
            {currentNode.selectionMode === 'multiple' && (
              <div className="mb-4">
                <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 mb-4">
                  <p className="text-purple-800 text-sm font-medium">
                    📋 Multiple Selection Mode: You can select multiple options that apply to your situation
                  </p>
                </div>
                {selectedOptions.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm font-medium mb-2">
                      Selected ({selectedOptions.length}): 
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedOptions.map(optionKey => (
                        <span key={optionKey} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                          {currentNode.options[optionKey].text}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Options */}
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {optionEntries.map(([optionKey, option], index) => {
              const isSelected = selectedOptions.includes(optionKey);
              const isMultipleMode = currentNode.selectionMode === 'multiple';
              
              return (
                <motion.button
                  key={optionKey}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleChoice(optionKey)}
                  className={`w-full p-4 rounded-lg transition-all duration-200 transform flex items-center justify-between group ${
                    isMultipleMode
                      ? isSelected
                        ? 'bg-purple-600 text-white border-2 border-purple-700'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  style={{ 
                    backgroundColor: !isMultipleMode ? (index % 2 === 0 ? '#3b82f6' : '#8b5cf6') : undefined
                  }}
                >
                  <div className="flex items-center">
                    {isMultipleMode && (
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                        isSelected ? 'bg-white border-white' : 'border-white'
                      }`}>
                        {isSelected && <span className="text-purple-600 text-sm">✓</span>}
                      </div>
                    )}
                    <span className="font-medium">{option.text}</span>
                  </div>
                  {!isMultipleMode && (
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Continue Button for Multiple Selection */}
          {currentNode.selectionMode === 'multiple' && (
            <div className="mt-6">
              <button
                onClick={confirmMultipleSelection}
                disabled={selectedOptions.length === 0}
                className="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold"
              >
                Continue with Selected Options ({selectedOptions.length})
              </button>
              <p className="text-center text-gray-500 text-sm mt-2">
                Select one or more options above, then click continue
              </p>
            </div>
          )}

          {/* Breadcrumb */}
          {userPath.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg overflow-y-auto max-h-40">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Your Investigation Journey:</h3>
              <div className="space-y-2">
                {userPath.map((step, index) => (
                  <div key={index} className="flex flex-wrap gap-1">
                    <span className="text-xs text-gray-600">Step {index + 1}:</span>
                    {step.selectedTexts ? (
                      // Multiple selection display
                      step.selectedTexts.map((text, textIndex) => (
                        <span
                          key={textIndex}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            step.selectionMode === 'multiple' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {text}
                        </span>
                      ))
                    ) : (
                      // Legacy single selection display
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {step.selectedTexts?.[0] || ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* End Investigation Button */}
          <button
            onClick={() => setShowEndModal(true)}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600 transition-colors"
          >
            End Investigation
          </button>

          {/* End Investigation Modal */}
          {showEndModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-bold mb-2">End Investigation</h2>
                <textarea
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Add a note (optional)..."
                  value={endNote}
                  onChange={e => setEndNote(e.target.value)}
                />
                <select
                  className="w-full border p-2 rounded mb-2"
                  value={manualResult}
                  onChange={e => setManualResult(e.target.value)}
                >
                  <option value="">Select Result</option>
                  <option value="Paused">Paused</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Closed - No Action">Closed - No Action</option>
                  <option value="Other">Other</option>
                </select>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowEndModal(false);
                      setCurrentNodeId(null);
                      setManuallyEnded(true);
                    }}
                  >
                    Confirm End
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={() => setShowEndModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={resetFlow}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Back to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  // Default return
  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        {/* ... existing default return code ... */}
      </div>
    </>
  );
};

export default InvestigationFlowchart; 