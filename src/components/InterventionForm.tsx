import { useState } from 'react'
import { supabase } from '../supabase/client'
import { Calendar, User, FileText, Send } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'

interface InterventionFormData {
    patientId: string
    interventionType: string
    notes: string
    scheduledDate: string
    technicianName: string
}

interface InterventionFormProps {
    onSuccess?: () => void
}

export function InterventionForm({ onSuccess }: InterventionFormProps) {
    const [formData, setFormData] = useState<InterventionFormData>({
        patientId: '',
        interventionType: '',
        notes: '',
        scheduledDate: '',
        technicianName: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const interventionTypes = [
        'Maintenance préventive',
        'Réparation matériel',
        'Installation nouveau matériel',
        'Formation patient',
        'Contrôle qualité',
        'Autre'
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('interventions')
                .insert({
                    patient_id: formData.patientId,
                    intervention_type: formData.interventionType,
                    notes: formData.notes,
                    scheduled_date: formData.scheduledDate,
                    technician_name: formData.technicianName,
                    status: 'scheduled'
                })

            if (error) throw error

            // Reset form
            setFormData({
                patientId: '',
                interventionType: '',
                notes: '',
                scheduledDate: '',
                technicianName: ''
            })

            onSuccess?.()
            alert('Intervention programmée avec succès !')
        } catch (error) {
            console.error('Error creating intervention:', error)
            alert('Erreur lors de la création de l\'intervention')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Nouvelle Intervention
                </CardTitle>
                <CardDescription>
                    Planifier une intervention technique pour un patient
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {/* Patient Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="patientId" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Patient
                        </Label>
                        <Input
                            id="patientId"
                            placeholder="ID ou nom du patient"
                            value={formData.patientId}
                            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                            required
                        />
                    </div>

                    {/* Intervention Type */}
                    <div className="space-y-2">
                        <Label htmlFor="interventionType">Type d'intervention</Label>
                        <Select
                            value={formData.interventionType}
                            onValueChange={(value) => setFormData({ ...formData, interventionType: value })}
                            required
                        >
                            <SelectTrigger id="interventionType">
                                <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                                {interventionTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Scheduled Date */}
                    <div className="space-y-2">
                        <Label htmlFor="scheduledDate" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date prévue
                        </Label>
                        <Input
                            id="scheduledDate"
                            type="datetime-local"
                            value={formData.scheduledDate}
                            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                            required
                        />
                    </div>

                    {/* Technician Name */}
                    <div className="space-y-2">
                        <Label htmlFor="technicianName">Technicien assigné</Label>
                        <Input
                            id="technicianName"
                            placeholder="Nom du technicien"
                            value={formData.technicianName}
                            onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                            required
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes / Instructions</Label>
                        <Textarea
                            id="notes"
                            placeholder="Détails de l'intervention, instructions spécifiques..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={4}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Création...' : 'Créer l\'intervention'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
