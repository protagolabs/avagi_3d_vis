from enum import Enum

class FileType(Enum):
    AVAGI = 'avagi_generate_file/'
    
    def __str__(self):
        return str(self.name)