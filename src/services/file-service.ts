import fs from 'fs'

export default function FileService() {
  function GetFileNameByInitials(
    initials: string,
    directory: string
  ): string | null {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      if (file.startsWith(initials)) {
        return file
      }
    }
    return null
  }

  return { GetFileNameByInitials }
}
