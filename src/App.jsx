import AppWrapper from './AppWrapper'

export default function App() {
  return (
    <AppWrapper>
      {({ dark, setDark }) => (
        <BrowserRouter>
          <MainLayout dark={dark} setDark={setDark}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/kasir" element={<Kasir />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      )}
    </AppWrapper>
  )
}