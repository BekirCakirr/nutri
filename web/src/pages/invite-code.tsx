import { useState, useEffect } from 'react'
import {
  Plus,
  Copy,
  QrCode,
  Check,
  XCircle,
  Ticket,
  CheckCircle2,
  Hash,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { PageContainer } from '@/components/shared/page-container'
import { FormPageSkeleton } from '@/components/shared/page-skeletons'
import { StatCard } from '@/components/shared/stat-card'

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
  { id: '3', code: 'NUTRI-C1D9-YT4L', createdAt: '2026-02-20', usedBy: 'Selin Koc', usedAt: '2026-02-21', status: 'used' },
  { id: '4', code: 'NUTRI-D6H3-WS8K', createdAt: '2026-02-18', usedBy: 'Emre Aydın', usedAt: '2026-02-19', status: 'used' },
  { id: '5', code: 'NUTRI-E4J7-UV2P', createdAt: '2026-02-15', usedBy: null, usedAt: null, status: 'expired' },
  { id: '6', code: 'NUTRI-F9M1-ZX6R', createdAt: '2026-02-10', usedBy: null, usedAt: null, status: 'deactivated' },
]

const statusMap: Record<
  InviteCode['status'],
  { label: string; variant: 'success' | 'info' | 'warning' | 'destructive' }
> = {
  active: { label: 'Aktif', variant: 'success' },
  used: { label: 'Kullanıldı', variant: 'info' },
  expired: { label: 'Suresi Dolmus', variant: 'warning' },
  deactivated: { label: 'Devre Dısı', variant: 'destructive' },
}

export default function InviteCodePage() {
  const [codes, setCodes] = useState(mockCodes)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 400); return () => clearTimeout(t) }, [])

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

  if (isLoading) return <FormPageSkeleton />

  const activeCodes = codes.filter(c => c.status === 'active').length
  const usedCodes = codes.filter(c => c.status === 'used').length

  return (
    <PageContainer
      title="Davet Kodları"
      description="Yeni hastalar davet etmek icin kod olusturun ve yonetin."
      actions={
        <Button onClick={handleGenerate}>
          <Plus className="h-4 w-4" />
          Yeni Kod Olustur
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-in-stagger">
        <StatCard
          title="Aktif Kodlar"
          value={activeCodes}
          icon={Ticket}
          color="green"
        />
        <StatCard
          title="Kullanılan Kodlar"
          value={usedCodes}
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Toplam Kod"
          value={codes.length}
          icon={Hash}
          color="default"
        />
      </div>

      {/* Codes Table */}
      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle className="text-base">Tum Kodlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>Olusturulma</TableHead>
                  <TableHead>Kullanan</TableHead>
                  <TableHead className="text-center">Durum</TableHead>
                  <TableHead className="text-right">Islemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow
                    key={code.id}
                    className="transition-colors duration-[var(--duration-fast)]"
                  >
                    <TableCell>
                      <code className="rounded-md bg-secondary px-2.5 py-1 text-sm font-mono font-medium">
                        {code.code}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {code.createdAt}
                    </TableCell>
                    <TableCell>
                      {code.usedBy ? (
                        <div>
                          <p className="text-sm font-medium">{code.usedBy}</p>
                          <p className="text-xs text-muted-foreground">{code.usedAt}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">--</span>
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
                          {copiedId === code.id ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
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
                            className="h-8 w-8 text-destructive hover:text-destructive"
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
          </div>
        </CardContent>
      </Card>

      {/* QR Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Kod</DialogTitle>
            <DialogDescription>Bu QR kodu hastanıza gosterin veya paylasin.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/50 mb-4">
              <div className="text-center text-muted-foreground">
                <QrCode className="mx-auto mb-2 h-16 w-16" />
                <p className="text-xs">QR Kod Alanı</p>
              </div>
            </div>
            <code className="rounded-lg bg-secondary px-4 py-2 font-mono text-sm font-medium">
              {selectedCode}
            </code>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
