import React from 'react';

const FileUpload = ({ onFileChange, selectedFile }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileData = {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      };
      onFileChange(fileData);
    }
  };

  return (
    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
        Прикріпити файл
      </label>
      <div style={{ 
        border: '2px dashed #e2e8f0', 
        padding: '15px', 
        borderRadius: '10px', 
        textAlign: 'center',
        background: selectedFile ? '#f0fdf4' : '#f8fafc'
      }}>
        <input 
          type="file" 
          id="goal-file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="goal-file" style={{ cursor: 'pointer', color: '#6366f1', fontWeight: 'bold' }}>
          {selectedFile ? `${selectedFile.name}` : 'Оберіть файл'}
        </label>
      </div>
    </div>
  );
};

export default FileUpload;