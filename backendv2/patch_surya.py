# Patch for Surya OCR config issue
import os
import sys
from pathlib import Path

def patch_surya_config():
    """
    Patches the Surya OCR config.py file to handle missing encoder key
    """
    try:
        import surya
        surya_path = Path(surya.__file__).parent
        config_path = surya_path / "recognition" / "model" / "config.py"
        
        if not config_path.exists():
            print(f"Could not find config file at {config_path}")
            return False
            
        # Read the file
        with open(config_path, 'r') as f:
            content = f.read()
            
        # Check if already patched
        if "kwargs.pop(\"encoder\", None)" in content:
            print("File already patched")
            return True
            
        # Apply patch - replace the problematic line
        patched_content = content.replace(
            "encoder_config = kwargs.pop(\"encoder\")",
            "encoder_config = kwargs.pop(\"encoder\", None)\n        if encoder_config is None:\n            print(\"Warning: Missing encoder config, using defaults\")\n            encoder_config = {}"
        )
        
        # Write back with backup
        backup_path = str(config_path) + ".bak"
        with open(backup_path, 'w') as f:
            f.write(content)
            
        with open(config_path, 'w') as f:
            f.write(patched_content)
            
        print(f"Successfully patched {config_path}")
        print(f"Backup saved to {backup_path}")
        return True
        
    except Exception as e:
        print(f"Error patching Surya: {e}")
        return False

if __name__ == "__main__":
    success = patch_surya_config()
    sys.exit(0 if success else 1)