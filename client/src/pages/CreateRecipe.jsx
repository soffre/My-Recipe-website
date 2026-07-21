import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { CREATE_RECIPE_MUTATION } from '../api/operations/recipes';
import { uploadImageToCloudinary } from '../api/cloudinary';
import LoadingSpinner from '../components/auth/LoadingSpinner';
import ErrorToast from '../components/auth/ErrorToast';

// ==========================================
// 1. SUB-COMPONENTS FOR CLEANER UI
// ==========================================

function Stepper({ currentStep }) {
  const steps = [
    { num: 1, label: 'Core Details' },
    { num: 2, label: 'Ingredients' },
    { num: 3, label: 'Instructions & Media' },
  ];

  return (
    <div className="mb-grid-4 flex items-center justify-between border-b border-tafach-border pb-grid-2">
      {steps.map((step) => (
        <div key={step.num} className="flex flex-1 items-center last:flex-none">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              currentStep >= step.num
                ? 'bg-tafach-orange text-white'
                : 'bg-tafach-border text-tafach-muted'
            }`}
          >
            {step.num}
          </div>
          <span
            className={`ml-2 hidden text-sm font-semibold sm:inline ${
              currentStep === step.num ? 'text-tafach-dark' : 'text-tafach-muted'
            }`}
          >
            {step.label}
          </span>
          {step.num < 3 && (
            <div
              className={`mx-4 h-0.5 flex-1 transition-colors ${
                currentStep > step.num ? 'bg-tafach-orange' : 'bg-tafach-border'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CoreDetails({ formData, setFormData }) {
  const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  // Predefined list of popular recipe categories
  const availableCategories = [
    'Breakfast', 'Lunch', 'Dinner', 'Dessert', 
    'Vegan', 'Vegetarian', 'Gluten-Free', 
    'Quick & Easy', 'Healthy', 'Snacks', 'Baking'
  ];

  const toggleCategory = (category) => {
    const current = formData.categories || [];
    if (current.includes(category)) {
      // Remove if already selected
      setFormData({ ...formData, categories: current.filter((c) => c !== category) });
    } else {
      // Add new category (optional: limit to max 3 categories to keep it clean)
      if (current.length < 3) {
        setFormData({ ...formData, categories: [...current, category] });
      }
    }
  };

  return (
    <div className="fade-in flex flex-col gap-grid-2">
      <h3 className="mb-grid-1 text-lg font-bold text-tafach-dark">Step 1: Core Recipe Specifications</h3>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Recipe Title</span>
        <input type="text" className="tafach-input" value={formData.title} onChange={handleChange('title')} placeholder="e.g., Authentic Doro Wat" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Short Story description</span>
        <textarea className="tafach-input h-24 resize-none" value={formData.description} onChange={handleChange('description')} placeholder="Describe the heritage of this culinary dish..." />
      </label>

      {/* NEW: Categories Selection */}
      <div className="flex flex-col gap-2 border-y border-tafach-border py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-tafach-dark">Categories / Tags</span>
          <span className="text-xs text-tafach-muted">Select up to 3</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((category) => {
            const isSelected = formData.categories?.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-tafach-orange text-white shadow-sm ring-2 ring-tafach-orange ring-offset-1'
                    : 'bg-tafach-light text-tafach-muted hover:bg-gray-200 hover:text-tafach-dark'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-grid-2 sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Prep Time (mins)</span>
          <input type="number" className="tafach-input" value={formData.prepTime} onChange={handleChange('prepTime')} min="1" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Cook Time (mins)</span>
          <input type="number" className="tafach-input" value={formData.cookTime} onChange={handleChange('cookTime')} min="1" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Servings Size</span>
          <input type="number" className="tafach-input" value={formData.servings} onChange={handleChange('servings')} min="1" />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Cuisine Type</span>
        <select className="tafach-input" value={formData.cuisine} onChange={handleChange('cuisine')}>
          <option value="Ethiopian">Ethiopian</option>
          <option value="Italian">Italian</option>
          <option value="French">French</option>
          <option value="American">American</option>
          <option value="Asian">Asian Fusion</option>
          <option value="Mexican">Mexican</option>
          <option value="Indian">Indian</option>
          <option value="Other">Other</option>
        </select>
      </label>
    </div>
  );
}

function IngredientsMatrix({ ingredients, setIngredients }) {
  const handleAdd = () => setIngredients([...ingredients, { name: '', amount: '', unit: 'grams' }]);
  
  const handleChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleRemove = (index) => {
    if (ingredients.length > 1) setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="fade-in flex flex-col gap-grid-2">
      <h3 className="mb-grid-1 text-lg font-bold text-tafach-dark">Step 2: Component Ingredients Matrix</h3>
      
      {ingredients.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input type="text" className="tafach-input flex-1" placeholder="Ingredient name" value={item.name} onChange={(e) => handleChange(index, 'name', e.target.value)} />
          <input type="number" className="tafach-input w-24" placeholder="Amount" value={item.amount} onChange={(e) => handleChange(index, 'amount', e.target.value)} />
          <select className="tafach-input w-28" value={item.unit} onChange={(e) => handleChange(index, 'unit', e.target.value)}>
            <option value="grams">grams</option>
            <option value="cups">cups</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
            <option value="pieces">pieces</option>
          </select>
          <button type="button" onClick={() => handleRemove(index)} className="flex h-10 w-10 items-center justify-center rounded border border-red-200 bg-red-50 text-sm font-bold text-tafach-error transition-colors hover:bg-red-100 disabled:opacity-30" disabled={ingredients.length === 1}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAdd} className="mt-2 self-start rounded-md border border-tafach-border bg-tafach-light px-4 py-2 text-sm font-bold text-tafach-dark hover:bg-gray-200">
        🌱 Add Another Ingredient Row
      </button>
    </div>
  );
}

function InstructionsAndMedia({ instructions, setInstructions, handleFileChange, previewUrls, handleRemovePhoto, thumbnailIndex, setThumbnailIndex, isPublishing }) {
  const handleAdd = () => setInstructions([...instructions, { message: '' }]);
  const handleChange = (index, value) => {
    const updated = [...instructions];
    updated[index].message = value;
    setInstructions(updated);
  };
  const handleRemove = (index) => {
    if (instructions.length > 1) setInstructions(instructions.filter((_, i) => i !== index));
  };

  return (
    <div className="fade-in flex flex-col gap-grid-3">
      <div>
        <h3 className="mb-grid-1 text-lg font-bold text-tafach-dark">Step 3: Cooking Instructions</h3>
        <div className="flex flex-col gap-grid-2">
          {instructions.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-tafach-orange">Step {index + 1}</span>
                <button type="button" onClick={() => handleRemove(index)} disabled={instructions.length === 1} className="text-xs font-semibold text-tafach-error hover:underline disabled:opacity-30">
                  Remove
                </button>
              </div>
              <textarea className="tafach-input h-20 resize-none" value={item.message} onChange={(e) => handleChange(index, e.target.value)} placeholder="e.g., Sauté the finely minced red onions..." />
            </div>
          ))}
          <button type="button" onClick={handleAdd} className="mt-2 self-start rounded-md border border-tafach-border bg-tafach-light px-4 py-2 text-sm font-bold text-tafach-dark hover:bg-gray-200">
            ➕ Add Cooking Step
          </button>
        </div>
      </div>

      <div className="border-t border-tafach-border pt-grid-3">
        <h3 className="mb-grid-1 text-lg font-bold text-tafach-dark">Recipe Photo Gallery</h3>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mb-4 block w-full text-sm text-tafach-muted file:mr-4 file:rounded-md file:border-0 file:bg-tafach-orange file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-600" />
        
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {previewUrls.map((url, index) => (
              <div key={index} className={`relative flex flex-col rounded border bg-white p-1 transition-all ${thumbnailIndex === index ? 'border-tafach-orange ring-2 ring-orange-200' : 'border-tafach-border'}`}>
                <img src={url} alt={`Preview ${index}`} className="h-24 w-full object-cover rounded" />
                <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 text-xs font-semibold">
                  <input type="radio" name="thumbnail" checked={thumbnailIndex === index} onChange={() => setThumbnailIndex(index)} />
                  Set as Cover
                </label>
                <button type="button" onClick={() => handleRemovePhoto(index)} disabled={isPublishing} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-tafach-dark text-xs font-bold text-white shadow hover:bg-black disabled:opacity-50">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. MAIN COMPONENT (LOGIC & STATE)
// ==========================================

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Grouped Core State
  const [coreData, setCoreData] = useState({
    title: '', 
    description: '', 
    prepTime: '', 
    cookTime: '', 
    servings: '', 
    cuisine: 'Ethiopian',
    categories: [] 
  });

  // Array States
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: 'grams' }]);
  const [instructions, setInstructions] = useState([{ message: '' }]);
  
  // Media States
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  const [createRecipe] = useMutation(CREATE_RECIPE_MUTATION);

  // --- MEDIA HANDLERS ---
  const handleFileSelectionChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setSelectedFiles([...selectedFiles, ...files]);
    const objectUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...objectUrls]);
  };

  const handleRemoveSelectedPhoto = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    if (thumbnailIndex >= selectedFiles.length - 1) setThumbnailIndex(0);
  };

  // --- VALIDATION & NAVIGATION ---
  const validateAndNext = () => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!coreData.title || !coreData.description || !coreData.prepTime || !coreData.cookTime || !coreData.servings) {
        setErrorMessage('All core profile text description fields are required.');
        return;
      }
      if (coreData.categories.length === 0) {
        setErrorMessage('Please select at least one category for your recipe.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const invalid = ingredients.some(ing => !ing.name || !ing.amount);
      if (invalid) {
        setErrorMessage('Please input valid names and numbers for all your ingredients rows.');
        return;
      }
      setCurrentStep(3);
    }
  };

  // --- SUBMISSION PIPELINE ---
  const handleFinalPublishSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      validateAndNext();
      return;
    }

    if (selectedFiles.length === 0) {
      setErrorMessage('Please upload at least one display photo for your recipe.');
      return;
    }

    setIsPublishing(true);
    setErrorMessage('');

    try {
      const uploadPromises = selectedFiles.map(file => uploadImageToCloudinary(file, 'recipes/gallery'));
      const uploadedImageUrls = await Promise.all(uploadPromises);
      const targetThumbnailUrl = uploadedImageUrls[thumbnailIndex];

      const formattedIngredients = ingredients.map(ing => ({
        name: ing.name.trim(),
        amount: parseFloat(ing.amount),
        unit: ing.unit
      }));

      const formattedInstructions = instructions.map((inst, index) => ({
        step_number: index + 1,
        message: inst.message.trim()
      }));

      await createRecipe({
        variables: {
          ...coreData,
          prepTime: parseInt(coreData.prepTime),
          cookTime: parseInt(coreData.cookTime),
          servings: parseInt(coreData.servings),
          thumbnailUrl: targetThumbnailUrl,
          images: uploadedImageUrls,
          ingredients: formattedIngredients,
          instructions: formattedInstructions
        }
      });

      previewUrls.forEach(url => URL.revokeObjectURL(url));
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected failure stalled your recipe creation upload layout.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="mx-auto mt-grid-2 w-full max-w-3xl rounded-lg border border-tafach-border bg-white p-grid-3 font-brand shadow-sm md:p-grid-4">
      <Stepper currentStep={currentStep} />
      <ErrorToast message={errorMessage} />

      <form onSubmit={handleFinalPublishSubmit} noValidate>
        {currentStep === 1 && <CoreDetails formData={coreData} setFormData={setCoreData} />}
        {currentStep === 2 && <IngredientsMatrix ingredients={ingredients} setIngredients={setIngredients} />}
        {currentStep === 3 && (
          <InstructionsAndMedia 
            instructions={instructions} setInstructions={setInstructions}
            handleFileChange={handleFileSelectionChange}
            previewUrls={previewUrls} handleRemovePhoto={handleRemoveSelectedPhoto}
            thumbnailIndex={thumbnailIndex} setThumbnailIndex={setThumbnailIndex}
            isPublishing={isPublishing}
          />
        )}

        {/* ACTION FOOTER */}
        <div className="mt-grid-4 flex items-center justify-between border-t border-tafach-border pt-grid-3">
          {currentStep > 1 ? (
            <button type="button" onClick={() => setCurrentStep(currentStep - 1)} disabled={isPublishing} className="rounded border border-tafach-border px-grid-3 py-2 text-sm font-semibold text-tafach-dark transition-colors hover:bg-tafach-light active:scale-95 disabled:opacity-40">
              ← Back
            </button>
          ) : <div />}

          {currentStep < 3 ? (
            <button type="submit" className="rounded bg-tafach-dark px-grid-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-black active:scale-95">
              Continue Forward →
            </button>
          ) : (
            <button type="submit" disabled={isPublishing} className="flex items-center gap-2 rounded bg-tafach-orange px-grid-3 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600 active:scale-95 disabled:opacity-70">
              {isPublishing && <LoadingSpinner />}
              {isPublishing ? 'Uploading assets & Publishing...' : '🚀 Publish Recipe Live'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}