import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table'
import { Button } from './ui/button'

interface Patient {
    id: string
    name: string
    serialNumber: string
    lastSync: string
    iahStatus: 'normal' | 'alert'
    iahValue: number
}

interface PatientListProps {
    patients: Patient[]
}

export function PatientList({ patients }: PatientListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState<'all' | 'alert'>('all')

    const filteredPatients = useMemo(() => {
        return patients.filter(patient => {
            const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesFilter = filter === 'all' || patient.iahStatus === 'alert'
            return matchesSearch && matchesFilter
        })
    }, [patients, searchQuery, filter])

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par nom ou N° de série..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        Tous ({patients.length})
                    </Button>
                    <Button
                        variant={filter === 'alert' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('alert')}
                    >
                        Alertes ({patients.filter(p => p.iahStatus === 'alert').length})
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>N° Série Machine</TableHead>
                            <TableHead>Dernière Synchro</TableHead>
                            <TableHead>Statut IAH</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPatients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    Aucun patient trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPatients.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium">{patient.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{patient.serialNumber}</TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(patient.lastSync).toLocaleString('fr-FR', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={patient.iahStatus === 'alert' ? 'destructive' : 'default'}
                                                className={patient.iahStatus === 'normal' ? 'bg-green-500' : ''}
                                            >
                                                {patient.iahStatus === 'alert' ? 'Alerte' : 'Normal'}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                IAH: {patient.iahValue}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="text-sm text-muted-foreground">
                {filteredPatients.length} patient{filteredPatients.length > 1 ? 's' : ''} affiché{filteredPatients.length > 1 ? 's' : ''}
            </div>
        </div>
    )
}
