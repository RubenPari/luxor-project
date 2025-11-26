import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { render, screen, waitFor } from './utils'
import userEvent from '@testing-library/user-event'

/**
 * Integration Test Example
 * 
 * This file demonstrates how to write integration tests that test
 * multiple components working together or API interactions.
 * 
 * Rename this file to remove .example to run the tests.
 */

// Mock API responses
const mockFetch = vi.fn()

describe('Integration Test Example', () => {
  beforeAll(() => {
    // Setup global mocks
    global.fetch = mockFetch
  })

  afterAll(() => {
    // Cleanup
    vi.restoreAllMocks()
  })

  it('example: fetches and displays data from API', async () => {
    // Mock API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Hello from API' }),
    })

    // This is a placeholder - replace with your actual component
    const TestComponent = () => {
      const [data, setData] = React.useState<string>('')

      React.useEffect(() => {
        fetch('/api/test')
          .then(res => res.json())
          .then(data => setData(data.message))
      }, [])

      return <div>{data || 'Loading...'}</div>
    }

    render(<TestComponent />)

    // Initially shows loading
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Wait for API data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Hello from API')).toBeInTheDocument()
    })

    // Verify API was called
    expect(mockFetch).toHaveBeenCalledWith('/api/test')
  })

  it('example: handles user flow across multiple interactions', async () => {
    const user = userEvent.setup()

    // This is a placeholder - replace with your actual component
    const MultiStepForm = () => {
      const [step, setStep] = React.useState(1)
      const [formData, setFormData] = React.useState({ name: '', email: '' })

      return (
        <div>
          {step === 1 && (
            <div>
              <h2>Step 1</h2>
              <input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <button onClick={() => setStep(2)}>Next</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2>Step 2</h2>
              <input
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <button onClick={() => setStep(3)}>Submit</button>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2>Success!</h2>
              <p>Name: {formData.name}</p>
              <p>Email: {formData.email}</p>
            </div>
          )}
        </div>
      )
    }

    render(<MultiStepForm />)

    // Step 1: Fill name
    expect(screen.getByText('Step 1')).toBeInTheDocument()
    const nameInput = screen.getByPlaceholderText('Name')
    await user.type(nameInput, 'John Doe')
    await user.click(screen.getByText('Next'))

    // Step 2: Fill email
    await waitFor(() => {
      expect(screen.getByText('Step 2')).toBeInTheDocument()
    })
    const emailInput = screen.getByPlaceholderText('Email')
    await user.type(emailInput, 'john@example.com')
    await user.click(screen.getByText('Submit'))

    // Step 3: Verify success
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument()
      expect(screen.getByText('Name: John Doe')).toBeInTheDocument()
      expect(screen.getByText('Email: john@example.com')).toBeInTheDocument()
    })
  })
})
