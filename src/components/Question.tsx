import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

export interface QuestionData {
  id: string;
  title: string;
  subtitle?: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'textarea' | 'select_with_custom' | 'multiselect_with_custom';
  options?: string[];
  placeholder?: string;
  required?: boolean;
  allowCustom?: boolean;
  customPlaceholder?: string;
}

interface QuestionProps {
  question: QuestionData;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onPrevious?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function Question({ 
  question, 
  value, 
  onChange, 
  onNext, 
  onPrevious, 
  isFirst, 
  isLast 
}: QuestionProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if required field has value
    let hasValue = false;
    if (question.type === 'select_with_custom') {
      hasValue = value?.selected || value?.custom;
    } else if (question.type === 'multiselect_with_custom') {
      hasValue = (value?.selected && value.selected.length > 0) || value?.custom;
    } else {
      hasValue = value;
    }
    
    if (hasValue || !question.required) {
      onNext();
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
      case 'number':
        return (
          <Input
            type={question.type}
            placeholder={question.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-emerald-500 transition-colors"
            autoFocus
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={question.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-emerald-500 transition-colors min-h-[120px]"
            autoFocus
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-emerald-500">
              <SelectValue placeholder={question.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option} className="text-lg py-3">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options?.map((option) => {
              const isSelected = Array.isArray(value) && value.includes(option);
              return (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => {
                    const currentValue = Array.isArray(value) ? value : [];
                    if (isSelected) {
                      onChange(currentValue.filter(v => v !== option));
                    } else {
                      onChange([...currentValue, option]);
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        );

      case 'select_with_custom':
        return (
          <div className="space-y-4">
            <Select value={value?.selected || ''} onValueChange={(selectedValue) => {
              onChange({ selected: selectedValue, custom: value?.custom || '' });
            }}>
              <SelectTrigger className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-emerald-500">
                <SelectValue placeholder={question.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option} className="text-lg py-3">
                    {option}
                  </SelectItem>
                ))}
                <SelectItem value="custom" className="text-lg py-3 text-emerald-600 font-medium">
                  ✏️ Custom (specify below)
                </SelectItem>
              </SelectContent>
            </Select>
            
            {(value?.selected === 'custom' || !value?.selected) && (
              <Input
                placeholder={question.customPlaceholder || 'Enter your custom option...'}
                value={value?.custom || ''}
                onChange={(e) => onChange({ selected: 'custom', custom: e.target.value })}
                className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-emerald-500 transition-colors"
              />
            )}
          </div>
        );

      case 'multiselect_with_custom':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options?.map((option) => {
                const isSelected = Array.isArray(value?.selected) && value?.selected.includes(option);
                return (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => {
                      const currentValue = Array.isArray(value?.selected) ? value.selected : [];
                      if (isSelected) {
                        onChange({ 
                          selected: currentValue.filter(v => v !== option), 
                          custom: value?.custom || '' 
                        });
                      } else {
                        onChange({ 
                          selected: [...currentValue, option], 
                          custom: value?.custom || '' 
                        });
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                ✏️ Add custom options (comma separated):
              </Label>
              <Input
                placeholder={question.customPlaceholder || 'e.g., Italian, Thai, Mexican...'}
                value={value?.custom || ''}
                onChange={(e) => onChange({ 
                  selected: value?.selected || [], 
                  custom: e.target.value 
                })}
                className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Question Header */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl md:text-4xl text-gray-800"
          >
            {question.title}
          </motion.h2>
          {question.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-gray-600"
            >
              {question.subtitle}
            </motion.p>
          )}
        </div>

        {/* Input Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          {renderInput()}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-between"
        >
          {!isFirst && onPrevious && (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="px-8 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={question.required && !(() => {
              if (question.type === 'select_with_custom') {
                return value?.selected || value?.custom;
              } else if (question.type === 'multiselect_with_custom') {
                return (value?.selected && value.selected.length > 0) || value?.custom;
              } else {
                return value;
              }
            })()}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            {isLast ? 'Get My Meal Plan' : 'Next'}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}