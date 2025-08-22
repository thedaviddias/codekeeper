// Test fixture - overly complex file that should trigger violations

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { Form } from '@/components/Form'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Checkbox } from '@/components/Checkbox'
import { Radio } from '@/components/Radio'
import { TextArea } from '@/components/TextArea'
import { DatePicker } from '@/components/DatePicker'
import { TimePicker } from '@/components/TimePicker'
import { ColorPicker } from '@/components/ColorPicker'
import { FileUpload } from '@/components/FileUpload'
import { Table } from '@/components/Table'
import { Pagination } from '@/components/Pagination'
import { Search } from '@/components/Search'
import { Filter } from '@/components/Filter'
import { Sort } from '@/components/Sort'
import { Export } from '@/components/Export'
import { Import } from '@/components/Import'
import { Notification } from '@/components/Notification'

// This file has too many functions, imports, lines, and high complexity

export function function1() {
  if (true) {
    if (true) {
      if (true) {
        if (true) {
          if (true) {
            if (true) {
              if (true) {
                if (true) {
                  if (true) {
                    if (true) {
                      if (true) {
                        return 'deeply nested'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export function function2() { return 'test' }
export function function3() { return 'test' }
export function function4() { return 'test' }
export function function5() { return 'test' }
export function function6() { return 'test' }
export function function7() { return 'test' }
export function function8() { return 'test' }
export function function9() { return 'test' }
export function function10() { return 'test' }
export function function11() { return 'test' }
export function function12() { return 'test' }
export function function13() { return 'test' }
export function function14() { return 'test' }
export function function15() { return 'test' }
export function function16() { return 'test' }
export function function17() { return 'test' }
export function function18() { return 'test' }
export function function19() { return 'test' }
export function function20() { return 'test' }

export function ComplexComponent() {
  const [state1, setState1] = useState('')
  const [state2, setState2] = useState('')
  const [state3, setState3] = useState('')
  const [state4, setState4] = useState('')
  const [state5, setState5] = useState('')
  const [state6, setState6] = useState('')
  const [state7, setState7] = useState('')
  const [state8, setState8] = useState('')
  const [state9, setState9] = useState('')
  const [state10, setState10] = useState('')

  const complexLogic = () => {
    for (let i = 0; i < 100; i++) {
      if (i % 2 === 0) {
        if (i % 4 === 0) {
          if (i % 8 === 0) {
            if (i % 16 === 0) {
              if (i % 32 === 0) {
                console.log('complex nested logic')
                try {
                  if (Math.random() > 0.5) {
                    switch (i) {
                      case 0:
                        if (true) {
                          while (true) {
                            break
                          }
                        }
                        break
                      case 1:
                        break
                      default:
                        break
                    }
                  } else {
                    throw new Error('random error')
                  }
                } catch (error) {
                  if (error instanceof Error) {
                    console.error(error.message)
                  } else {
                    console.error('unknown error')
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return (
    <div>
      <span>Very complex component with many lines</span>
      <span>Line 100</span>
      <span>Line 101</span>
      <span>Line 102</span>
      <span>Line 103</span>
      <span>Line 104</span>
      <span>Line 105</span>
      <span>Line 106</span>
      <span>Line 107</span>
      <span>Line 108</span>
      <span>Line 109</span>
      <span>Line 110</span>
      <span>Line 111</span>
      <span>Line 112</span>
      <span>Line 113</span>
      <span>Line 114</span>
      <span>Line 115</span>
      <span>Line 116</span>
      <span>Line 117</span>
      <span>Line 118</span>
      <span>Line 119</span>
      <span>Line 120</span>
    </div>
  )
}