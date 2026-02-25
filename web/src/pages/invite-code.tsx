import { useState } from 'react'
import {
  Plus,
  Copy,
  QrCode,
  Check,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface InviteCode {
  id: string
  code: string
  createdAt: string
  usedBy: string | null
  usedAt: string | null
  status: 'active' | 'used' | 'expired' | 'deactivated'
}

const mockCodes: InviteCode[] = [
  { id: '1', code: 'NUTRI-A3K7-XP2M', createdAt: '2026-02-25', usedBy: null, usedAt: null, status: 'active' },
  { id: '2', code: 'NUTRI-B8F2-QR5N', createdAt: '2026-02-24', usedBy: null, usedAt: null, status: 'active' },
  { id: '3', code: 'NUTRI-C1D9-YT4L', createdAt: '2026-02-20', usedBy: 'Selin Koç', usedAt: '2026-02-21', status: 'used' },
  { id: '4', code: 'NUTRI-D6H3-WS8K', createdAt: '2026-02-18', usedBy: 'Emre Aydın', usedAt: '2026-02-19', status: 'used' },
  { id: '5', code: 'NUTRI-E4J7-UV2P', createdAt: '2026-02-15', usedBy: null, usedAt: null, status: 'expired' },
  { id: '6', code: 'NUTRI-F9M1-ZX6R', createdAt: '2026-02-10', usedBy: null, usedAt: null, status: 'deactivated' },
]

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Aktif', variant: 'default' },
  used: { label: 'Kullanıldı', variant: 'secondary' },
  expired: { label: 'Süresi Dolmuş', variant: 'outline' },
  deactivated: { label: 'Devre Dışı', variant: 'destructive' },
}

export default function InviteCodePage() {
  const [codes, setCodes] = useState(mockCodes)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleGenerate = () => {
    const newCode: InviteCode = {
      id: String(codes.length + 1),
      code: `NUTRI-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      createdAt: '2026-02-25',
      usedBy: null,
      usedAt: null,
      status: 'active',
    }
    setCodes(prev => [newCode, ...prev])
  }

  const handleDeactivate = (id: string) => {
    setCodes(prev => prev.map(c => c.id === id ? { ...c, status: 'deactivated' as const } : c))
  }

  const handleShowQR = (code: string) => {
    setSelectedCode(code)
    setQrDialogOpen(true)
  }

  const activeCodes = codes.filter(c => c.status === 'active').length
  const usedCodes = codes.filter(c => c.status === 'used').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Davet Kodları</h1>
          <p className="text-muted-foreground">Yeni hastalar davet etmek için kod oluşturun ve yönetin.</p>
        </div>
        <Button onClick={handleGenerate}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kod Oluştur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Aktif Kodlar</p>
            <p className="text-2xl font-bold text-green-600">{activeCodes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Kullanılan Kodlar</p>
            <p className="text-2xl font-bold text-blue-600">{usedCodes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Toplam Kod</p>
            <p className="text-2xl font-bold">{codes.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Kodlar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kod</TableHead>
                <TableHead>Oluşturulma</TableHead>
                <TableHead>Kullanan</TableHead>
                <TableHead className="text-center">Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{code.code}</code>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{code.createdAt}</TableCell>
                  <TableCell>
                    {code.usedBy ? (
                      <div>
                        <p className="text-sm">{code.usedBy}</p>
                        <p className="text-xs text-muted-foreground">{code.usedAt}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusMap[code.status].variant}>
                      {statusMap[code.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopy(code.code, code.id)}
                        disabled={code.status !== 'active'}
                      >
                        {copiedId === code.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleShowQR(code.code)}
                        disabled={code.status !== 'active'}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      {code.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeactivate(code.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* QR Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Kod</DialogTitle>
            <DialogDescription>Bu QR kodu hastanıza gösterin veya paylaşın.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="h-48 w-48 bg-muted rounded-lg border-2 border-dashed flex items-center justify-center mb-4">
              <div className="text-center text-muted-foreground">
                <QrCode className="h-16 w-16 mx-auto mb-2" />
                <p className="text-xs">QR Kod Alanı</p>
              </div>
            </div>
            <code className="bg-muted px-4 py-2 rounded font-mono text-sm">{selectedCode}</code>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
