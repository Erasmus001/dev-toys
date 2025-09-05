# Mock API Generator

A powerful tool for generating realistic mock API responses from JSON schemas, designed to help frontend developers test their applications without requiring a real backend.

## Features

### 🎯 Core Functionality
- **JSON Schema Input**: Define data structure using standard JSON Schema syntax
- **Realistic Data Generation**: Uses Faker.js for authentic fake data (names, emails, addresses, etc.)
- **Customizable Output**: Control record count, status codes, and response format
- **Real-time Generation**: Automatic mock data generation as you type
- **Multiple Locales**: Support for different languages and regions

### 🔧 Configuration Options
- **Record Count**: Generate 1-100 mock records
- **HTTP Status Codes**: Simulate different API responses (200, 404, 500, etc.)
- **Response Wrapper**: Option to wrap data in realistic API response format
- **Faker.js Integration**: Toggle realistic vs. simple mock data
- **Locale Settings**: Choose from multiple languages for generated data

### 📁 File Operations
- **Schema Import**: Drag-and-drop or upload JSON schema files
- **Data Export**: Download generated mock data as JSON files
- **Copy to Clipboard**: One-click copying of generated data

## Usage Examples

### Basic User Profile Schema
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1
    },
    "name": {
      "type": "string",
      "faker": "person.fullName"
    },
    "email": {
      "type": "string",
      "format": "email",
      "faker": "internet.email"
    },
    "age": {
      "type": "integer",
      "minimum": 18,
      "maximum": 80
    }
  },
  "required": ["id", "name", "email"]
}
```

### E-commerce Product Schema
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "faker": "string.uuid"
    },
    "name": {
      "type": "string",
      "faker": "commerce.productName"
    },
    "price": {
      "type": "number",
      "minimum": 1,
      "maximum": 1000,
      "faker": "commerce.price"
    },
    "category": {
      "type": "string",
      "faker": "commerce.department"
    },
    "inStock": {
      "type": "boolean"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "faker": "lorem.word"
      },
      "minItems": 1,
      "maxItems": 5
    }
  }
}
```

## Faker.js Integration

The tool supports Faker.js methods for realistic data generation:

### Common Faker Methods
- `person.fullName` - Full names
- `internet.email` - Email addresses
- `location.city` - City names
- `commerce.productName` - Product names
- `lorem.sentence` - Lorem ipsum text
- `date.future` - Future dates
- `string.uuid` - UUID strings
- `image.avatar` - Avatar URLs

### Usage in Schema
```json
{
  "propertyName": {
    "type": "string",
    "faker": "person.fullName"
  }
}
```

## API Response Format

With "Include Response Wrapper" enabled:

```json
{
  "status": 200,
  "statusText": "OK",
  "data": [
    // Your generated mock data here
  ],
  "metadata": {
    "count": 5,
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "schema": {
      // Original schema
    }
  }
}
```

## Tips for Better Mock Data

1. **Use Faker.js Extensions**: Add `"faker": "method.name"` to schema properties for realistic data
2. **Set Constraints**: Use `minimum`, `maximum`, `minItems`, `maxItems` for controlled ranges
3. **Enum Values**: Use `"enum": ["option1", "option2"]` for predefined choices
4. **Required Fields**: Specify `"required": ["field1", "field2"]` for mandatory properties
5. **Nested Objects**: Create complex nested structures for realistic API responses

## Integration with Development Workflow

- **Frontend Testing**: Use generated data to test UI components
- **API Prototyping**: Create mock responses for API design discussions
- **Demo Data**: Generate sample data for presentations and demos
- **Load Testing**: Create large datasets for performance testing

## Privacy & Security

- ✅ **Client-side Processing**: All data generation happens in your browser
- ✅ **No Data Transmission**: Schemas and generated data never leave your device
- ✅ **Offline Capable**: Works without internet connection once loaded
- ✅ **No Storage**: No personal data is stored or tracked