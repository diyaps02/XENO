import React from "react"
import { useState } from "react"

const RuleBuilder = ({ onRulesChange, onPreview }) => {
  const [rules, setRules] = useState([{ field: "totalSpend", operator: ">", value: "", logic: "AND" }])

  const fields = [
    { value: "totalSpend", label: "Total Spend" },
    { value: "visitCount", label: "Visit Count" },
    { value: "gender", label: "Gender" },
    { value: "lastPurchase", label: "Last Purchase" },
  ]

  const operators = {
    totalSpend: [
      { value: ">", label: "Greater than" },
      { value: "<", label: "Less than" },
      { value: "=", label: "Equal to" },
    ],
    visitCount: [
      { value: ">", label: "Greater than" },
      { value: "<", label: "Less than" },
      { value: "=", label: "Equal to" },
    ],
    gender: [{ value: "=", label: "Equal to" }],
    lastPurchase: [
      { value: ">", label: "After" },
      { value: "<", label: "Before" },
    ],
  }

  const addRule = () => {
    setRules([...rules, { field: "totalSpend", operator: ">", value: "", logic: "AND" }])
  }

  const removeRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index)
    setRules(newRules)
    updateCriteria(newRules)
  }

  const updateRule = (index, field, value) => {
    const newRules = [...rules]
    newRules[index][field] = value
    setRules(newRules)
    updateCriteria(newRules)
  }

  const updateCriteria = (currentRules) => {
    const criteria = currentRules
      .map((rule, index) => {
        let ruleString = ""
        if (rule.field === "gender") {
          ruleString = `${rule.field} ${rule.operator} "${rule.value}"`
        } else if (rule.field === "lastPurchase") {
          // Format date as YYYY-MM-DD for criteria string
          const formattedDate = rule.value ? new Date(rule.value).toISOString().split('T')[0] : "";
          ruleString = `${rule.field} ${rule.operator} "${formattedDate}"`
        } else {
          ruleString = `${rule.field} ${rule.operator} ${rule.value}`
        }

        if (index > 0) {
          ruleString = `${rule.logic} ${ruleString}`
        }

        return ruleString
      })
      .join(" ")

    onRulesChange(criteria)
  }

  const handlePreviewClick = () => {
    updateCriteria(rules);
    if (onPreview) onPreview();
  };

  const getValueInput = (rule, index) => {
    if (rule.field === "gender") {
      return (
        <select
          value={rule.value}
          onChange={(e) => updateRule(index, "value", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      )
    } else if (rule.field === "lastPurchase") {
      return (
        <input
          type="date"
          value={rule.value}
          onChange={(e) => updateRule(index, "value", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )
    }

    return (
      <input
        type={rule.field.includes("Date") ? "date" : "number"}
        value={rule.value}
        onChange={(e) => updateRule(index, "value", e.target.value)}
        placeholder="Enter value"
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Segment Rules</h3>
        <button onClick={addRule} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">
          Add Rule
        </button>
      </div>

      {rules.map((rule, index) => (
        <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
          {index > 0 && (
            <select
              value={rule.logic}
              onChange={(e) => updateRule(index, "logic", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}

          <select
            value={rule.field}
            onChange={(e) => updateRule(index, "field", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>

          <select
            value={rule.operator}
            onChange={(e) => updateRule(index, "operator", e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {operators[rule.field]?.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>

          {getValueInput(rule, index)}

          {rules.length > 1 && (
            <button onClick={() => removeRule(index)} className="text-red-500 hover:text-red-700 p-2">
              ✕
            </button>
          )}
        </div>
      ))}

      <button onClick={handlePreviewClick} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
        Preview Audience Size
      </button>
    </div>
  )
}

export default RuleBuilder
