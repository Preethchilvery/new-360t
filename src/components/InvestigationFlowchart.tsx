import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, Edit, Trash2, Play, RotateCcw, Save, Download, Eye, X } from 'lucide-react';
import NodeForm from './NodeForm';

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
        const newSelections = prev.includes(optionKey)
          ? prev.filter(key => key !== optionKey)
          : [...prev, optionKey];
        return newSelections;
      });
    } else {
      proceedWithSelection([optionKey]);
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
    const pathData = userPath.map(step => ({
      question: step.question,
      selectedOptions: step.selectedTexts,
      timestamp: step.timestamp
    }));

    const blob = new Blob([JSON.stringify(pathData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investigation-path.json';
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
    const handleAddNode = () => {
      setShowNodeForm(true);
      setEditingNode(null);
    };

    const handleEditNode = (node: Node) => {
      setEditingNode(node);
      setShowNodeForm(true);
    };

    const handleSaveNode = (nodeData: NodeFormData) => {
      if (editingNode) {
        // Update existing node
        const updatedFlowchart: Flowchart = {
          ...flowchart,
          nodes: flowchart.nodes.map((node: Node) =>
            node.id === editingNode.id ? { ...node, ...nodeData } : node
          )
        };
        setFlowchart(updatedFlowchart);
        saveFlowchart(updatedFlowchart);
      } else {
        // Add new node
        const newNodeId = `node_${flowchart.nodes.length + 1}`;
        const newNode: Node = {
          id: newNodeId,
          ...nodeData
        };
        const updatedFlowchart: Flowchart = {
          ...flowchart,
          nodes: [...flowchart.nodes, newNode]
        };
        setFlowchart(updatedFlowchart);
        saveFlowchart(updatedFlowchart);
      }
      setShowNodeForm(false);
      setEditingNode(null);
    };

    const handleCancelNodeForm = () => {
      setShowNodeForm(false);
      setEditingNode(null);
    };

    return (
      <>
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Trade Investigation Admin Panel</h1>
                <div className="flex gap-4">
                  <button
                    onClick={handleAddNode}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
                  >
                    Add New Node
                  </button>
                  <button
                    onClick={() => setMode('user')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
                  >
                    Test Investigation
                  </button>
                </div>
              </div>

              {/* Nodes List */}
              <div className="space-y-4">
                {flowchart.nodes.map((node: Node) => (
                  <div key={node.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{node.question}</h3>
                        <p className="text-sm text-gray-600 mt-1">ID: {node.id}</p>
                        <p className="text-sm text-gray-600">Type: {node.isEndpoint ? 'ENDPOINT' : 'QUESTION'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditNode(node)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNode(node.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {!node.isEndpoint && (
                      <div className="mt-3">
                        <h4 className="font-bold text-gray-700">Options:</h4>
                        <ul className="list-disc list-inside mt-2">
                          {Object.entries(node.options).map(([key, option]: [string, Option]) => (
                            <li key={key} className="text-gray-600">
                              {option.text} → {option.nextNodeId}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {showNodeForm && (
          <NodeForm
            node={editingNode}
            onSave={handleSaveNode}
            onCancel={handleCancelNodeForm}
          />
        )}
      </>
    );
  }

  // User Flow
  if (mode === 'user') {
    const currentNode = currentNodeId ? flowchart.nodes.find(node => node.id === currentNodeId) : null;

    return (
      <>
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-800">Trade Investigation Progress</h2>
                  <span className="text-sm text-gray-600">
                    Step {userPath.length + 1} of {flowchart.nodes.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round(((userPath.length + 1) / (flowchart.nodes.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Current Question */}
              {currentNode && !currentNode.isEndpoint ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800">{currentNode.question}</h3>
                  <div className="space-y-3">
                    {Object.entries(currentNode.options).map(([key, option]) => (
                      <button
                        key={key}
                        onClick={() => handleChoice(key)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                          selectedOptions.includes(key)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                  {currentNode.selectionMode === 'multiple' && selectedOptions.length > 0 && (
                    <button
                      onClick={() => proceedWithSelection(selectedOptions)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors"
                    >
                      Continue with Selected Options
                    </button>
                  )}
                </div>
              ) : currentNode?.isEndpoint ? (
                <div className="text-center py-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Investigation Complete!</h3>
                  <p className="text-gray-600 mb-6">{currentNode.endpointMessage}</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setShowPathView(true);
                        setMode('admin');
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
                    >
                      View Investigation Path
                    </button>
                    <button
                      onClick={() => {
                        setCurrentNodeId(flowchart.startNodeId);
                        setUserPath([]);
                        setSelectedOptions([]);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
                    >
                      Start New Investigation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Trade Investigation</h3>
                  <p className="text-gray-600 mb-6">Click below to start your investigation</p>
                  <button
                    onClick={() => setCurrentNodeId(flowchart.startNodeId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg"
                  >
                    Start Investigation
                  </button>
                </div>
              )}

              {/* Investigation Path History */}
              {userPath.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Your Investigation Path</h4>
                  <div className="space-y-4">
                    {userPath.map((step, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-bold text-gray-800">{step.question}</p>
                        <p className="text-gray-600 mt-2">
                          Selected: {step.selectedTexts.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
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