import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Download, Upload, FileText, FileUp, FileDown, Loader2, RefreshCcw } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function DataManagementPage() {
    const { transactions } = useAppStore() // Mock transactions for export filters
    const [csvFile, setCsvFile] = useState<File | null>(null)
    const [ofxFile, setOfxFile] = useState<File | null>(null)
    const [isImporting, setIsImporting] = useState(false)
    const [importMessage, setImportMessage] = useState<string | null>(null)

    const csvFileInputRef = useRef<HTMLInputElement>(null)
    const ofxFileInputRef = useRef<HTMLInputElement>(null)

    const [exportFilterPeriod, setExportFilterPeriod] = useState('all')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        } else {
            setFile(null)
        }
    }

    const handleImport = async (fileType: 'csv' | 'ofx', file: File | null) => {
        if (!file) {
            setImportMessage('Por favor, selecione um arquivo para importar.')
            return
        }
        setIsImporting(true)
        setImportMessage(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch(`http://localhost:3000/v1/data/import/${fileType}`,
                {
                    method: 'POST',
                    body: formData,
                    // Headers like Authorization: Bearer YOUR_TOKEN would go here in a real app
                }
            )

            const result = await response.json()

            if (response.ok) {
                setImportMessage(`Sucesso! ${result.count} transações importadas de ${file.name}.`)
                // TODO: Refresh transactions in frontend store
            } else {
                setImportMessage(`Erro ao importar: ${result.message || 'Verifique o formato do arquivo.'}`)
            }
        } catch (error) {
            setImportMessage(`Erro de conexão ao importar. A API está online?`)
            console.error('Import error:', error)
        } finally {
            setIsImporting(false)
            if (fileType === 'csv') setCsvFile(null)
            if (fileType === 'ofx') setOfxFile(null)
        }
    }

    const handleDownloadTemplate = () => {
        window.open('http://localhost:3000/v1/data/template', '_blank')
    }

    const handleExport = (exportType: 'csv' | 'pdf') => {
        // Construir filtros de exportação (mock para agora)
        let queryParams = ''
        // if (exportFilterPeriod === 'last-month') queryParams = '?startDate=...&endDate=...'

        window.open(`http://localhost:3000/v1/data/export/${exportType}${queryParams}`, '_blank')
    }

    return (
        <div className="container-custom py-6 md:py-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Importação e Exportação</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie seus dados financeiros em massa. Importe extratos ou exporte relatórios detalhados.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Import Section */}
                <div className="space-y-8">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <FileUp className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Importar Transações</h2>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                            Envie seus extratos para adicionar várias transações de uma vez. 
                            Certifique-se de usar o formato correto.
                        </p>

                        {importMessage && (
                            <div className="bg-primary/10 text-primary border border-primary/20 p-3 rounded-lg text-sm mb-4">
                                {importMessage}
                            </div>
                        )}

                        {/* CSV Import */}
                        <div className="space-y-4 border-t pt-6">
                            <h3 className="font-semibold">Importar CSV</h3>
                            <Button variant="outline" className="gap-2" onClick={handleDownloadTemplate}>
                                <Download className="h-4 w-4" /> Baixar Template CSV
                            </Button>
                            <div className="flex gap-2 items-center">
                                <Input 
                                    type="file" 
                                    accept=".csv" 
                                    onChange={(e) => handleFileChange(e, setCsvFile)}
                                    ref={csvFileInputRef}
                                    className="flex-1"
                                />
                                <Button 
                                    onClick={() => handleImport('csv', csvFile)}
                                    disabled={!csvFile || isImporting}
                                    className="gap-2"
                                >
                                    {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Importar
                                </Button>
                            </div>
                        </div>

                        {/* OFX Import */}
                        <div className="space-y-4 border-t pt-6 mt-6">
                            <h3 className="font-semibold">Importar OFX</h3>
                            <p className="text-sm text-muted-foreground">
                                Importe extratos bancários no formato OFX. (Ex: Itaú, Bradesco, BB).
                            </p>
                            <div className="flex gap-2 items-center">
                                <Input 
                                    type="file" 
                                    accept=".ofx,.qfx" 
                                    onChange={(e) => handleFileChange(e, setOfxFile)}
                                    ref={ofxFileInputRef}
                                    className="flex-1"
                                />
                                <Button 
                                    onClick={() => handleImport('ofx', ofxFile)}
                                    disabled={!ofxFile || isImporting}
                                    className="gap-2"
                                >
                                    {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Importar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Export Section */}
                <div className="space-y-8">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <FileDown className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Exportar Dados</h2>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                            Baixe seus dados transacionais em diferentes formatos.
                        </p>

                        {/* Export Filters */}
                        <div className="space-y-2 mb-6">
                            <label className="text-sm font-medium">Período de Exportação</label>
                            <Select 
                                value={exportFilterPeriod}
                                onChange={e => setExportFilterPeriod(e.target.value)}
                            >
                                <option value="all">Todas as Transações</option>
                                <option value="this-month">Este Mês</option>
                                <option value="last-month">Mês Passado</option>
                                <option value="this-year">Este Ano</option>
                            </Select>
                        </div>

                        {/* Export CSV */}
                        <div className="space-y-3 border-t pt-6">
                            <h3 className="font-semibold">Exportar para CSV</h3>
                            <p className="text-sm text-muted-foreground">
                                Exporta todas as transações (ou filtradas) para um arquivo CSV.
                            </p>
                            <Button onClick={() => handleExport('csv')} className="w-full gap-2">
                                <FileText className="h-4 w-4" /> Baixar CSV
                            </Button>
                        </div>

                        {/* Export PDF */}
                        <div className="space-y-3 border-t pt-6 mt-6">
                            <h3 className="font-semibold">Exportar para PDF</h3>
                            <p className="text-sm text-muted-foreground">
                                Gere um relatório PDF formatado com suas transações.
                            </p>
                            <Button onClick={() => handleExport('pdf')} className="w-full gap-2" variant="outline">
                                <Download className="h-4 w-4" /> Baixar Relatório PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
