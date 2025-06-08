import React, { useState } from 'react';

interface NodeFormProps {
  node?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const NodeForm: React.FC<NodeFormProps> = ({ node, onSave, onCancel }) => {
  const [options, setOptions] = useState(() => {
    if (node && node.options) {
      return node.options;
    }
    return { option1: { text: '', nextNodeId: '' }, option2: { text: '', nextNodeId: '' } };
  });

  const [question, setQuestion] = useState(node?.question || '');
  const [isEndpoint, setIsEndpoint] = useState(node?.isEndpoint || false);
  const [endpointMessage, setEndpointMessage] = useState(node?.endpointMessage || '');

  const optionKeys = Object.keys(options);

  const addOption = () => {
    const newKey = `option${optionKeys.length + 1}`;
    setOptions({
      ...options,
      [newKey]: { text: '', nextNodeId: '' }
    });
  };

  const removeOption = (key: string) => {
    if (optionKeys.length <= 2) return;
    const newOptions = { ...options };
    delete newOptions[key];
    setOptions(newOptions);
  };

  const updateOption = (key: string, field: string, value: string) => {
    setOptions({
      ...options,
      [key]: { ...options[key], [field]: value }
    });
  };

  const handleSave = () => {
    onSave({
      question,
      options,
      isEndpoint,
      endpointMessage,
      selectionMode: isEndpoint ? 'single' : 'multiple'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg">
          <h3 className="text-xl font-bold">
            {node ? 'EDIT NODE' : 'ADD NEW NODE'}
          </h3>
          <p className="text-blue-100 mt-1">Multiple Options Available!</p>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Question Input */}
            {!isEndpoint && (
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Question/Message</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                  rows={3}
                  placeholder="Enter your question here..."
                />
              </div>
            )}

            {/* Endpoint Toggle */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isEndpoint}
                  onChange={(e) => setIsEndpoint(e.target.checked)}
                  className="mr-3 w-5 h-5"
                />
                <span className="font-bold text-gray-700">This is an endpoint (final step)</span>
              </label>
            </div>

            {/* Endpoint Message */}
            {isEndpoint ? (
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Final Message</label>
                <textarea
                  value={endpointMessage}
                  onChange={(e) => setEndpointMessage(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500"
                  rows={4}
                  placeholder="Enter the final result message..."
                />
              </div>
            ) : (
              /* OPTIONS SECTION */
              <div className="bg-gray-50 p-6 rounded-lg">
                {/* Options Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Response Options</h4>
                    <p className="text-gray-600">Currently: {optionKeys.length} options</p>
                  </div>
                  <button
                    onClick={addOption}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors"
                  >
                    + ADD OPTION
                  </button>
                </div>

                {/* Options List */}
                <div className="space-y-4">
                  {optionKeys.map((key, index) => (
                    <div key={key} className="bg-white p-4 rounded-lg border-2 border-blue-200">
                      {/* Option Header */}
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-bold text-blue-700 text-lg">
                          OPTION {index + 1}
                        </h5>
                        {optionKeys.length > 2 && (
                          <button
                            onClick={() => removeOption(key)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold"
                          >
                            DELETE
                          </button>
                        )}
                      </div>

                      {/* Option Text */}
                      <div className="mb-3">
                        <label className="block text-sm font-bold mb-1">Option Text</label>
                        <input
                          type="text"
                          value={options[key].text}
                          onChange={(e) => updateOption(key, 'text', e.target.value)}
                          className="w-full p-2 border-2 border-gray-300 rounded focus:border-blue-500"
                          placeholder={`Enter text for option ${index + 1}`}
                        />
                      </div>

                      {/* Next Node */}
                      <div>
                        <label className="block text-sm font-bold mb-1">Next Node</label>
                        <input
                          type="text"
                          value={options[key].nextNodeId || ''}
                          onChange={(e) => updateOption(key, 'nextNodeId', e.target.value)}
                          className="w-full p-2 border-2 border-gray-300 rounded focus:border-blue-500"
                          placeholder="Enter next node ID (e.g., node_2)"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Success Message */}
                {optionKeys.length > 2 && (
                  <div className="mt-4 bg-green-100 border-2 border-green-400 p-4 rounded-lg">
                    <p className="text-green-800 font-bold text-center">
                      ✅ MULTIPLE OPTIONS ACTIVE! You have {optionKeys.length} options.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-4 rounded-b-lg">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors"
          >
            SAVE CHANGES
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeForm; 