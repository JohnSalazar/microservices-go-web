import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react'

type SearchContextType = {
  word: string
  search: (word: string) => void
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

type SearchProps = {
  children: React.ReactNode
}

const SearchContext = createContext({} as SearchContextType)

export function SearchProvider({ children }: SearchProps) {
  const [word, setWord] = useState(' ')
  const [loading, setLoading] = useState(false)

  const handleWord = (word: string) => {
    if (word.length === 0) {
      word = ' '
    }
    setWord(word)
  }

  return (
    <SearchContext.Provider
      value={{
        word,
        search: handleWord,
        loading,
        setLoading,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  return context
}
